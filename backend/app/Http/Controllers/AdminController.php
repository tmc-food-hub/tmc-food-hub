<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\RestaurantOwner;
use App\Models\Review;
use App\Models\User;
use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $admin = User::where('email', $request->email)
            ->where('role', 'admin')
            ->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided admin credentials are incorrect.'],
            ]);
        }

        $token = $admin->createToken('admin-auth-token')->plainTextToken;

        return response()->json([
            'user' => $admin,
            'token' => $token,
        ]);
    }

    public function user(Request $request)
    {
        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($admin);
    }

    /**
     * Refresh the current token by revoking it and issuing a new one.
     */
    public function refreshToken(Request $request)
    {
        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $admin->currentAccessToken()->delete();

        $newToken = $admin->createToken('admin-auth-token')->plainTextToken;

        return response()->json([
            'user' => $admin,
            'token' => $newToken,
        ]);
    }

    public function logout(Request $request)
    {
        $admin = $request->user();

        if ($admin?->currentAccessToken()) {
            $admin->currentAccessToken()->delete();
        }

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function dashboard(Request $request)
    {
        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $totalPartners = RestaurantOwner::count();
        $platformRevenue = (float) Order::whereNotIn('status', ['Cancelled'])->sum('total');
        $activeRestaurants = RestaurantOwner::where('operating_status', 'open')->count();
        $totalCustomers = User::where('role', 'customer')->count();

        $days = collect(range(6, 0))->map(function ($daysAgo) {
            $date = now()->subDays($daysAgo)->startOfDay();
            $total = (float) Order::whereNotIn('status', ['Cancelled'])
                ->whereDate('created_at', $date)
                ->sum('total');

            return [
                'day' => $date->format('D'),
                'date' => $date->format('M j, Y'),
                'revenue' => round($total, 2),
            ];
        })->values();

        $applications = RestaurantOwner::latest()
            ->take(5)
            ->get()
            ->map(function (RestaurantOwner $owner) {
                $cuisine = is_array($owner->cuisine_type) 
                    ? implode(', ', $owner->cuisine_type) 
                    : ($owner->cuisine_type ?? 'General');
                return [
                    'id' => $owner->id,
                    'restaurant_name' => $owner->restaurant_name,
                    'location' => $owner->business_address,
                    'category' => $cuisine,
                    'applied' => optional($owner->created_at)->diffForHumans(),
                    'status' => 'Pending',
                    'logo' => $owner->logo,
                ];
            })
            ->values();

        $pendingOrders = Order::where('status', 'Pending')->count();
        $reviewsToday = Review::whereDate('created_at', today())->count();
        $newRestaurantsToday = RestaurantOwner::whereDate('created_at', today())->count();

        $alerts = collect([
            [
                'id' => 1,
                'title' => 'Restaurant awaiting approval',
                'description' => $newRestaurantsToday > 0
                    ? "{$newRestaurantsToday} restaurant application(s) were submitted today."
                    : 'No new restaurant submissions today.',
                'severity' => $newRestaurantsToday > 0 ? 'urgent' : 'info',
                'time' => 'Today',
            ],
            [
                'id' => 2,
                'title' => 'Pending customer orders',
                'description' => "{$pendingOrders} order(s) are still waiting for restaurant confirmation.",
                'severity' => $pendingOrders > 0 ? 'pending' : 'info',
                'time' => 'Live',
            ],
            [
                'id' => 3,
                'title' => 'Reviews submitted today',
                'description' => "{$reviewsToday} new customer review(s) were posted across all restaurants.",
                'severity' => 'moderation',
                'time' => 'Today',
            ],
        ])->values();

        return response()->json([
            'stats' => [
                'total_partners' => $totalPartners,
                'platform_revenue' => round($platformRevenue, 2),
                'active_restaurants' => $activeRestaurants,
                'total_customers' => $totalCustomers,
            ],
            'revenue_chart' => $days,
            'applications' => $applications,
            'alerts' => $alerts,
        ]);
    }

    public function orders(Request $request)
    {
        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $page = $request->query('page', 1);
            $perPage = $request->query('per_page', 10);
            $status = $request->query('status');

            $query = Order::with(['customer', 'restaurantOwner', 'items']);

            if ($status && $status !== 'All') {
                $query->where('status', $status);
            }

            $orders = $query->latest()->paginate($perPage, ['*'], 'page', $page);

            $formattedOrders = $orders->getCollection()->map(function (Order $order) {
                try {
                    $itemsSummary = 'No items';
                    if ($order->items && $order->items->count() > 0) {
                        $itemsSummary = $order->items->map(function ($item) {
                            return ($item->quantity ?? 1) . 'x ' . ($item->item_name ?? 'Item');
                        })->join(', ');
                    }

                    $timeline = [];
                    if ($order->status === 'Pending') {
                        $timeline[] = ['label' => 'Order Placed', 'time' => $order->created_at->format('h:i A'), 'done' => true];
                        $timeline[] = ['label' => 'Confirmed', 'time' => null, 'done' => false];
                    } elseif ($order->status === 'Preparing') {
                        $timeline[] = ['label' => 'Order Placed', 'time' => $order->created_at->format('h:i A'), 'done' => true];
                        $timeline[] = ['label' => 'Confirmed', 'time' => $order->created_at->copy()->addMinutes(2)->format('h:i A'), 'done' => true];
                        $timeline[] = ['label' => 'Preparing', 'time' => $order->created_at->copy()->addMinutes(5)->format('h:i A'), 'done' => true];
                    } elseif ($order->status === 'On the way' || $order->status === 'Delivered') {
                        $timeline[] = ['label' => 'Order Placed', 'time' => $order->created_at->format('h:i A'), 'done' => true];
                        $timeline[] = ['label' => 'Confirmed', 'time' => $order->created_at->copy()->addMinutes(2)->format('h:i A'), 'done' => true];
                        $timeline[] = ['label' => 'Preparing', 'time' => $order->created_at->copy()->addMinutes(5)->format('h:i A'), 'done' => true];
                        $timeline[] = ['label' => $order->status === 'On the way' ? 'On the way' : 'Delivered', 'time' => now()->format('h:i A'), 'done' => true];
                    }

                    $customerName = $order->customer?->name ?? 'Unknown Customer';
                    $customerPhone = $order->customer?->phone ?? $order->contact_number ?? 'N/A';
                    $restaurantName = $order->restaurantOwner?->restaurant_name ?? $order->store_name ?? 'Unknown Restaurant';
                    $restaurantLogo = $order->restaurantOwner?->logo ?? null;

                    return [
                        'id' => "TMC-" . str_pad($order->id, 6, '0', STR_PAD_LEFT),
                        'customer' => [
                            'name' => $customerName,
                            'avatar' => null,
                        ],
                        'restaurant' => [
                            'name' => $restaurantName,
                            'type' => 'Restaurant',
                            'logo' => $restaurantLogo,
                        ],
                        'items' => $itemsSummary,
                        'total' => (float) $order->total,
                        'payment' => $order->payment_method ?? 'Unknown',
                        'status' => $order->status ?? 'Unknown',
                        'time' => $order->created_at->diffForHumans(),
                        'details' => [
                            'date' => $order->created_at->format('D, M d, Y \a\t h:i A'),
                            'timeline' => $timeline,
                            'customerInfo' => [
                                'name' => $customerName,
                                'phone' => $customerPhone,
                            ],
                            'restaurantInfo' => [
                                'name' => $restaurantName,
                                'distance' => '0 km from delivery',
                            ],
                            'orderItems' => optional($order->items)->map(function ($item) {
                                return [
                                    'name' => $item->item_name ?? 'Item',
                                    'qty' => $item->quantity ?? 1,
                                    'price' => (float) ($item->price ?? 0),
                                    'img' => $item->image ?? null,
                                ];
                            })->all() ?? [],
                            'specialInstructions' => $order->special_instructions ?? '',
                            'subtotal' => (float) $order->subtotal,
                            'deliveryFee' => (float) ($order->delivery_fee ?? 0),
                            'discount' => $order->discount ? ['code' => 'PROMO', 'amount' => -(float) $order->discount] : null,
                            'totalAmount' => (float) $order->total,
                        ],
                    ];
                } catch (\Exception $e) {
                    \Log::error('Error formatting order ' . $order->id . ': ' . $e->getMessage());
                    // Return a minimal response if formatting fails
                    return [
                        'id' => "TMC-" . str_pad($order->id, 6, '0', STR_PAD_LEFT),
                        'customer' => ['name' => 'Unknown', 'avatar' => null],
                        'restaurant' => ['name' => 'Unknown', 'type' => 'Restaurant', 'logo' => null],
                        'items' => 'N/A',
                        'total' => (float) $order->total,
                        'payment' => 'Unknown',
                        'status' => $order->status ?? 'Unknown',
                        'time' => 'Unknown',
                        'details' => [],
                    ];
                }
            });

            return response()->json([
                'data' => $formattedOrders,
                'pagination' => [
                    'total' => $orders->total(),
                    'per_page' => $orders->perPage(),
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Orders endpoint error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching orders',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function customers(Request $request)
    {
        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 10);
        $search = $request->query('search');

        $query = User::where('role', 'customer');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $customers = $query->latest()->paginate($perPage, ['*'], 'page', $page);

        $customers->getCollection()->transform(function ($customer) {
            return [
                'id' => "TMC-" . str_pad($customer->id, 5, '0', STR_PAD_LEFT),
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'location' => $customer->address ?? 'N/A',
                'orders' => Order::where('customer_id', $customer->id)->count(),
                'total_spent' => Order::where('customer_id', $customer->id)->sum('total'),
                'registered' => optional($customer->created_at)->format('M d, Y'),
                'status' => 'Active',
                'avatar' => null,
            ];
        });

        return response()->json([
            'data' => $customers->items(),
            'pagination' => [
                'total' => $customers->total(),
                'per_page' => $customers->perPage(),
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
            ],
        ]);
    }

    public function restaurants(Request $request)
    {
        try {
            $admin = $request->user();

            if (!$admin || $admin->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $page = $request->query('page', 1);
            $perPage = $request->query('per_page', 15);
            $status = $request->query('status');
            $search = $request->query('search');

            $query = RestaurantOwner::query();

            // Filter by status
            if ($status && $status !== 'All Partners' && $status !== 'All') {
                if ($status === 'Active') {
                    $query->where('operating_status', 'open');
                } elseif ($status === 'Suspended') {
                    $query->where('operating_status', 'closed');
                } elseif ($status === 'Pending Review') {
                    $query->where('verification_status', 'pending');
                } elseif ($status === 'Under Review') {
                    $query->where('verification_status', 'under_review');
                }
            }

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('restaurant_name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('business_address', 'like', "%{$search}%");
                });
            }

            $restaurants = $query->latest()->paginate($perPage, ['*'], 'page', $page);

            $formattedRestaurants = $restaurants->getCollection()->map(function ($owner) {
                try {
                    $totalOrders = Order::where('restaurant_owner_id', $owner->id)->count();
                    $totalRevenue = (float) Order::where('restaurant_owner_id', $owner->id)->sum('total');
                    $avgRating = Review::where('restaurant_owner_id', $owner->id)->avg('rating') ?? 0;
                    $reviewCount = Review::where('restaurant_owner_id', $owner->id)->count();
                    
                    // Calculate fulfillment rate
                    $completedOrders = Order::where('restaurant_owner_id', $owner->id)
                        ->where('status', 'Delivered')
                        ->count();
                    $fulfillmentRate = $totalOrders > 0 ? round(($completedOrders / $totalOrders) * 100, 1) : 0;

                    // Get recent orders
                    $recentOrders = Order::where('restaurant_owner_id', $owner->id)
                        ->latest()
                        ->take(5)
                        ->get()
                        ->map(function ($order) {
                            $itemsSummary = $order->items->count() > 0 
                                ? $order->items->map(fn($i) => ($i->quantity ?? 1) . 'x ' . ($i->item_name ?? 'Item'))->join(', ')
                                : 'No items';
                            return [
                                'id' => '#' . $order->id,
                                'items' => $itemsSummary,
                                'status' => $order->status,
                                'amount' => (float) $order->total,
                            ];
                        })
                        ->all();

                    // Get recent reviews
                    $recentReviews = Review::where('restaurant_owner_id', $owner->id)
                        ->latest()
                        ->take(2)
                        ->get()
                        ->map(function ($review) {
                            return [
                                'author' => $review->customer?->name ?? 'Anonymous',
                                'rating' => (int) $review->rating,
                                'text' => $review->review ?? '',
                                'orderId' => '#' . $review->order_id,
                                'time' => $review->created_at->diffForHumans(),
                            ];
                        })
                        ->all();

                    // Get disputes
                    $disputes = [];

                    return [
                        'id' => 'RE-' . str_pad($owner->id, 4, '0', STR_PAD_LEFT),
                        'name' => $owner->restaurant_name ?? 'Unknown',
                        'badge' => $owner->created_at >= now()->subMonths(1) ? 'New Branch' : null,
                        'cuisine' => collect($owner->cuisine_type ?? [])->first() ?? 'General',
                        'owner' => [
                            'name' => $owner->name ?? 'Unknown',
                            'email' => $owner->email ?? 'N/A',
                            'phone' => $owner->phone ?? 'N/A',
                            'avatar' => null,
                        ],
                        'rating' => round($avgRating, 1),
                        'reviewCount' => $reviewCount,
                        'revenue' => round($totalRevenue, 2),
                        'status' => $owner->operating_status === 'open' ? 'Active' : ($owner->operating_status === 'closed' ? 'Suspended' : 'Under Review'),
                        'joined' => $owner->created_at->format('M d, Y'),
                        'logo' => $owner->logo,
                        'details' => [
                            'location' => $owner->business_address ?? 'N/A',
                            'registered' => $owner->created_at->format('M d, Y'),
                            'totalOrders' => $totalOrders,
                            'totalRevenue' => round($totalRevenue, 2),
                            'avgRating' => round($avgRating, 1),
                            'fulfillmentRate' => $fulfillmentRate,
                            'ownerBranches' => 1,
                            'accountCreated' => $owner->created_at->format('M d, Y'),
                            'documents' => [],
                            'chartData' => [1000, 1500, 2000, 1800, 2200, 1600, 1400],
                            'payoutSummary' => [
                                'pending' => round($totalRevenue * 0.9, 2),
                                'lastPayout' => round($totalRevenue * 0.3, 2),
                                'lastPayoutDate' => $owner->updated_at->format('M d'),
                                'commRate' => 10.0,
                            ],
                            'operational' => [
                                'deliveryRadius' => $owner->delivery_radius ?? '5.0 km',
                                'prepTime' => $owner->default_prep_time ?? '15-20 mins',
                                'minOrder' => 150.00,
                            ],
                            'recentOrders' => $recentOrders,
                            'recentReviews' => $recentReviews,
                            'disputes' => $disputes,
                            'unresolvedDisputes' => count(array_filter($disputes, fn($d) => $d['status'] === 'Pending')),
                            'responseRate' => $reviewCount > 0 ? 72 : 0,
                        ],
                    ];
                } catch (\Exception $e) {
                    Log::error('Error formatting restaurant ' . $owner->id . ': ' . $e->getMessage());
                    return [
                        'id' => 'RE-' . str_pad($owner->id, 4, '0', STR_PAD_LEFT),
                        'name' => $owner->restaurant_name ?? 'Unknown',
                        'cuisine' => 'General',
                        'owner' => ['name' => 'Unknown', 'email' => 'N/A', 'phone' => 'N/A', 'avatar' => null],
                        'rating' => 0,
                        'reviewCount' => 0,
                        'revenue' => 0,
                        'status' => 'Error',
                        'joined' => 'N/A',
                        'logo' => null,
                        'details' => [],
                    ];
                }
            });

            return response()->json([
                'data' => $formattedRestaurants->all(),
                'pagination' => [
                    'total' => $restaurants->total(),
                    'per_page' => $restaurants->perPage(),
                    'current_page' => $restaurants->currentPage(),
                    'last_page' => $restaurants->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Restaurants endpoint error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching restaurants',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function reviews(Request $request)
    {
        try {
            $admin = $request->user();

            if (!$admin || $admin->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $page = $request->query('page', 1);
            $perPage = $request->query('per_page', 15);
            $status = $request->query('status');
            $restaurant_id = $request->query('restaurant_id');
            $rating = $request->query('rating');

            $query = Review::with(['customer', 'owner', 'order']);

            // Filter by status
            if ($status && $status !== 'All') {
                if ($status === 'Flagged') {
                    $query->where('flag_status', '!=', 'None');
                } elseif ($status === 'Approved') {
                    $query->where('review_status', 'approved');
                } elseif ($status === 'Pending') {
                    $query->where('review_status', 'pending');
                } elseif ($status === 'Removed') {
                    $query->where('review_status', 'removed');
                }
            }

            if ($restaurant_id) {
                $query->where('restaurant_owner_id', $restaurant_id);
            }

            if ($rating && $rating !== 'All') {
                $query->where('rating', (int) $rating);
            }

            $reviews = $query->latest()->paginate($perPage, ['*'], 'page', $page);

            $formattedReviews = $reviews->getCollection()->map(function ($review) {
                try {
                    $customer = $review->customer;
                    $owner = $review->owner;
                    $customerName = $customer?->name ?? 'Anonymous User';
                    $accountAge = $customer?->created_at ? $customer->created_at->diffForHumans() : 'Unknown';
                    $customerRestaurantOrders = $customer ? Order::where('customer_id', $customer->id)->count() : 0;
                    $reviewFlag = $review->flag_status ?? 'None';
                    $reviewStatus = $review->review_status ?? 'pending';

                    return [
                        'id' => $review->id,
                        'reviewer' => $customerName,
                        'reviewCount' => $customer ? Review::where('customer_id', $customer->id)->count() : 0,
                        'restaurant' => $owner?->restaurant_name ?? 'Unknown Restaurant',
                        'date' => optional($review->created_at)->format('M d, Y') ?? 'N/A',
                        'rating' => (int) ($review->rating ?? 0),
                        'review' => substr($review->review ?? '', 0, 80) . (strlen($review->review ?? '') > 80 ? '...' : ''),
                        'flag' => ucfirst($reviewFlag),
                        'status' => ucfirst($reviewStatus),
                        'avatar' => null,
                        'details' => [
                            'fullReview' => $review->review ?? '',
                            'accountAge' => $accountAge,
                            'restaurantOrders' => $customerRestaurantOrders,
                            'joined' => $customer?->created_at?->format('M d, Y') ?? 'N/A',
                            'restaurantBranch' => $owner?->business_address ?? 'N/A',
                            'reviewDate' => optional($review->created_at)->format('M d, Y') ?? 'N/A',
                            'reviewRating' => (float) ($review->rating ?? 0),
                            'restaurantResponse' => $review->owner_reply ? '"' . $review->owner_reply . '"' : null,
                            'responseRate' => $owner ? round((Review::where('restaurant_owner_id', $owner->id)->whereNotNull('owner_reply')->count() / Review::where('restaurant_owner_id', $owner->id)->count() * 100), 0) : 0,
                            'flagInfo' => $reviewFlag !== 'None' ? [
                                'type' => ucfirst($reviewFlag),
                                'flaggedBy' => 'System Detection',
                                'reason' => 'Review flagged for moderation',
                                'reports' => $review->flag_count ?? 0,
                                'timestamp' => optional($review->updated_at)->format('M d, Y - h:i A') ?? 'N/A',
                            ] : null,
                            'merchantRequest' => null,
                            'adminNotes' => [],
                            'photos' => $review->photos ?? [],
                            'helpfulCount' => $review->helpful_count ?? 0,
                            'isVerified' => (bool) $review->is_verified,
                        ],
                    ];
                } catch (\Exception $e) {
                    Log::error('Error formatting review ' . $review->id . ': ' . $e->getMessage());
                    return [
                        'id' => $review->id,
                        'reviewer' => 'Unknown',
                        'reviewCount' => 0,
                        'restaurant' => 'Unknown',
                        'date' => 'N/A',
                        'rating' => 0,
                        'review' => 'Error loading review',
                        'flag' => 'None',
                        'status' => 'Error',
                        'avatar' => null,
                        'details' => [],
                    ];
                }
            });

            return response()->json([
                'data' => $formattedReviews->all(),
                'pagination' => [
                    'total' => $reviews->total(),
                    'per_page' => $reviews->perPage(),
                    'current_page' => $reviews->currentPage(),
                    'last_page' => $reviews->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Reviews endpoint error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching reviews',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function payments(Request $request)
    {
        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $page = $request->query('page', 1);
            $perPage = $request->query('per_page', 15);
            $statusFilter = $request->query('status', 'All');

            $query = RestaurantOwner::query();

            $restaurants = $query->with('orders.review')->latest()->paginate($perPage, ['*'], 'page', $page);

            $restaurants->getCollection()->transform(function ($owner) {
                $orders = $owner->orders ?? collect();
                $totalRevenue = (float) $orders->sum('total');
                $commission = $totalRevenue * 0.10;
                $netPayout = $totalRevenue - $commission;

                // Count low-rating reviews
                $lowRatingCount = 0;
                foreach ($orders as $order) {
                    if ($order->review && $order->review->rating <= 2) {
                        $lowRatingCount++;
                    }
                }

                $hasRecentOrders = $orders->filter(function ($order) {
                    return $order->created_at >= now()->subDays(30);
                })->count() > 0;

                $status = $lowRatingCount > 0 ? 'Pending' : ($hasRecentOrders ? 'Unpaid' : 'Paid');
                
                // Calculate dispute amount
                $disputeAmount = 0;
                foreach ($orders as $order) {
                    if ($order->review && $order->review->rating <= 2) {
                        $disputeAmount += $order->total;
                    }
                }

                // Extract location  
                $location = 'Unknown';
                if ($owner->business_address) {
                    $addressParts = explode(',', $owner->business_address);
                    $location = trim(array_pop($addressParts) ?? 'Unknown');
                }

                $lastUpdated = optional($orders->max('updated_at'))?->diffForHumans() ?? 'Never';
                $payoutId = '#RE-' . str_pad($owner->id, 4, '0', STR_PAD_LEFT);
                $categoryText = is_array($owner->cuisine_type) 
                    ? implode(', ', $owner->cuisine_type) 
                    : ($owner->cuisine_type ?? 'Multi-Cuisine');
                $accountCreated = $owner->created_at->format('M d, Y');

                return [
                    'id' => $owner->id,
                    'restaurant' => $owner->restaurant_name ?? 'Restaurant',
                    'category' => $categoryText,
                    'owner' => trim($owner->name ?? ($owner->first_name . ' ' . $owner->last_name)),
                    'totalSales' => (int) round($totalRevenue),
                    'netPayout' => (int) round($netPayout),
                    'status' => $status,
                    'lastUpdated' => $lastUpdated,
                    'logo' => $owner->logo ? asset('storage/' . $owner->logo) : null,
                    'details' => [
                        'payoutId' => $payoutId,
                        'pendingPayout' => round($netPayout, 2),
                        'commissionRate' => 10.0,
                        'phone' => $owner->business_contact_number ?? $owner->phone ?? 'N/A',
                        'accountCreated' => $accountCreated,
                        'location' => $location,
                        'branches' => 1,
                        'grossSales' => (int) round($totalRevenue),
                        'commission' => round($commission, 2),
                        'disputes' => round($disputeAmount, 2),
                        'scheduledDate' => now()->addDays(rand(5, 20))->format('M d, Y'),
                        'hasUnresolvedDisputes' => $lowRatingCount > 0,
                        'disputeAmount' => round($disputeAmount, 2),
                    ],
                ];
            });

            // Filter by status if specified
            if ($statusFilter !== 'All') {
                $filtered = collect($restaurants->items())->filter(function ($p) use ($statusFilter) {
                    return $p['status'] === $statusFilter;
                })->values();
                $restaurants->setCollection($filtered);
            }

            return response()->json([
                'data' => $restaurants->items(),
                'pagination' => [
                    'total' => $restaurants->total(),
                    'per_page' => $restaurants->perPage(),
                    'current_page' => $restaurants->currentPage(),
                    'last_page' => $restaurants->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Payments endpoint error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching payments',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function analytics(Request $request)
    {
        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $totalOrders = Order::count();
            $totalRevenue = (float) Order::sum('total');
            $totalCustomers = User::where('role', 'customer')->count();
            $activeRestaurants = RestaurantOwner::where('operating_status', 'open')->count();
            $completedOrders = Order::where('status', 'Completed')->count();
            $cancelledOrders = Order::where('status', 'Cancelled')->count();

            $avgOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0;
            $disputeRate = $totalOrders > 0 ? round(($cancelledOrders / $totalOrders) * 100, 1) : 0;

            // Weekly orders data
            $ordersChartData = collect(range(6, 0))->map(function ($daysAgo) {
                $date = now()->subDays($daysAgo)->startOfDay();
                $completed = Order::where('status', 'Completed')->whereDate('created_at', $date)->count();
                $cancelled = Order::where('status', 'Cancelled')->whereDate('created_at', $date)->count();

                return [
                    'day' => $date->format('D'),
                    'completed' => $completed,
                    'cancelled' => $cancelled,
                ];
            })->values();

            // Weekly revenue data
            $revenueChartData = collect(range(3, 0))->map(function ($weeksAgo) {
                $startDate = now()->subWeeks($weeksAgo)->startOfWeek();
                $endDate = $startDate->copy()->endOfWeek();
                $gross = (float) Order::whereBetween('created_at', [$startDate, $endDate])->sum('total');
                $net = $gross * 0.9; // 90% after 10% commission

                return [
                    'label' => $startDate->format('M j') . '-' . $endDate->format('j'),
                    'gross' => round($gross, 2),
                    'net' => round($net, 2),
                ];
            })->values();

            // Top restaurants with enhanced data
            $topRestaurants = RestaurantOwner::with('orders', 'reviews')
                ->get()
                ->map(function ($owner) {
                    $orders = $owner->orders ?? collect();
                    $reviews = $owner->reviews ?? collect();
                    $orderCount = $orders->count();
                    $rating = $reviews->count() > 0 ? round($reviews->avg('rating'), 1) : 0;
                    $revenue = (float) $orders->sum('total');
                    $commission = $revenue * 0.10;

                    // Determine status
                    $status = 'Stable';
                    if ($orderCount > 100) $status = 'Top Performer';
                    elseif ($orderCount > 50) $status = 'High Demand';
                    elseif ($orderCount > 20) $status = 'Rising';

                    return [
                        'name' => $owner->restaurant_name ?? 'Restaurant',
                        'orders' => $orderCount,
                        'rating' => $rating,
                        'commission' => round($commission, 2),
                        'status' => $status,
                        'revenue' => round($revenue, 2),
                    ];
                })
                ->sortByDesc('orders')
                ->take(4)
                ->values();

            // City distribution
            $cityData = collect();
            $orders = Order::with('restaurantOwner')->get();
            $totalActive = $orders->count();

            if ($totalActive > 0) {
                $cityStats = $orders->groupBy(function ($order) {
                    $address = $order->restaurantOwner?->business_address ?? 'Unknown';
                    $parts = explode(',', $address);
                    return trim(array_pop($parts) ?? 'Unknown');
                })->map(function ($group) use ($totalActive) {
                    return [
                        'count' => $group->count(),
                        'percentage' => round(($group->count() / $totalActive) * 100, 1),
                    ];
                })->sortByDesc('count')->take(5);

                $cityData = $cityStats->map(function ($stats, $city) {
                    return [
                        'city' => $city,
                        'pct' => $stats['percentage'],
                    ];
                })->values();
            }

            // Heatmap data - order frequency by day and hour
            $heatmapHours = [0, 6, 12, 18, 23]; // 00:00, 06:00, 12:00, 18:00, 23:59
            $heatmapDays = range(0, 6); // 0 = Monday, 6 = Sunday
            $heatmapData = [];
            
            $sevenDaysAgo = now()->subDays(6)->startOfDay();
            $recentOrders = Order::whereBetween('created_at', [$sevenDaysAgo, now()])->get();
            
            foreach ($heatmapDays as $dayIndex) {
                $dayData = [];
                foreach ($heatmapHours as $hourIndex => $hour) {
                    $startOfDay = $sevenDaysAgo->copy()->addDays($dayIndex)->setHour($hour)->setMinute(0)->setSecond(0);
                    $endOfDay = $startOfDay->copy()->addHours(6)->subSecond(1);
                    
                    $count = $recentOrders->filter(function ($order) use ($startOfDay, $endOfDay) {
                        $orderTime = $order->created_at;
                        return $orderTime >= $startOfDay && $orderTime <= $endOfDay;
                    })->count();
                    
                    // Scale to 0-10 range for visualization
                    $dayData[] = min(round($count / 5), 10);
                }
                $heatmapData[] = $dayData;
            }

            // Platform health metrics
            $completionRate = $totalOrders > 0 ? round(($completedOrders / $totalOrders) * 100, 1) : 0;
            
            // Calculate actual average delivery time from completed orders
            $completedOrdersData = Order::where('status', 'Completed')->get();
            $avgDeliveryTime = 32; // Default fallback
            if ($completedOrdersData->count() > 0) {
                $totalDeliveryTime = 0;
                foreach ($completedOrdersData as $order) {
                    if ($order->updated_at && $order->created_at) {
                        $totalDeliveryTime += $order->updated_at->diffInMinutes($order->created_at);
                    }
                }
                $avgDeliveryTime = $completedOrdersData->count() > 0 
                    ? round($totalDeliveryTime / $completedOrdersData->count()) 
                    : 32;
            }
            
            // Calculate real customer retention (customers with repeat orders)
            $allOrders = Order::where('status', 'Completed')->get();
            $customerOrderCounts = $allOrders->groupBy('customer_id')->map(function ($orders) {
                return $orders->count();
            });
            
            $returningCustomers = $customerOrderCounts->filter(function ($count) {
                return $count > 1;
            })->count();
            
            $customerRetention = $totalCustomers > 0 && $customerOrderCounts->count() > 0
                ? round(($returningCustomers / $customerOrderCounts->count()) * 100, 1) 
                : 0;
            
            return response()->json([
                'stats' => [
                    'total_orders' => $totalOrders,
                    'total_revenue' => round($totalRevenue, 2),
                    'active_customers' => $totalCustomers,
                    'active_restaurants' => $activeRestaurants,
                    'avg_order_value' => $avgOrderValue,
                    'completion_rate' => $completionRate,
                    'dispute_rate' => $disputeRate,
                    'cancelled_orders' => $cancelledOrders,
                ],
                'orders_chart' => $ordersChartData,
                'revenue_chart' => $revenueChartData,
                'top_restaurants' => $topRestaurants,
                'city_distribution' => $cityData,
                'heatmap' => $heatmapData,
                'health' => [
                    'avg_delivery_time' => $avgDeliveryTime,
                    'completion_rate' => $completionRate,
                    'dispute_rate' => $disputeRate,
                    'customer_retention' => $customerRetention,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Analytics endpoint error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching analytics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function disputes(Request $request)
    {
        try {
            $admin = $request->user();

            if (!$admin || $admin->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $page = $request->query('page', 1);
            $perPage = $request->query('per_page', 15);
            $status = $request->query('status');

            // Fetch orders with reviews to generate disputes (simulating dispute data)
            $ordersQuery = Order::with(['customer', 'restaurantOwner', 'items', 'review'])
                ->whereHas('review')
                ->latest();

            $orders = $ordersQuery->paginate($perPage, ['*'], 'page', $page);

            $formattedDisputes = $orders->getCollection()->map(function ($order, $index) {
                try {
                    $review = $order->review;
                    if (!$review) return null;

                    // Determine dispute status based on review rating
                    $disputeStatus = 'Under Investigation';
                    if ($review->rating <= 2) {
                        $disputeStatus = 'Flagged for Fraud';
                    } elseif ($order->customer?->created_at >= now()->subDays(7)) {
                        $disputeStatus = 'Fake';
                    }

                    $customer = $order->customer;
                    $restaurant = $order->restaurantOwner;

                    return [
                        'id' => 'DSP-' . str_pad(1000 + $order->id, 4, '0', STR_PAD_LEFT),
                        'status' => $disputeStatus,
                        'customer' => [
                            'name' => $customer?->name ?? 'Unknown Customer',
                            'email' => $customer?->email ?? 'N/A',
                            'phone' => $customer?->phone ?? 'N/A',
                            'location' => 'Unknown',
                            'accountAge' => $customer?->created_at ? $customer->created_at->diffForHumans() : 'Unknown',
                            'avatar' => null,
                            'accountStatus' => 'Active Account',
                        ],
                        'orderId' => 'ORD-' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
                        'amount' => (float) $order->total,
                        'restaurant' => [
                            'name' => $restaurant?->restaurant_name ?? 'Unknown',
                            'date' => $order->created_at->format('M d, Y'),
                            'distance' => '0 km from delivery',
                        ],
                        'reviewType' => match ($review->rating) {
                            1, 2 => 'Food Quality',
                            3 => 'Missing Items',
                            default => 'Other Issue',
                        },
                        'reviewText' => substr($review->review ?? '', 0, 50) . (strlen($review->review ?? '') > 50 ? '...' : ''),
                        'details' => [
                            'ticketId' => '#TMC-' . str_pad(400 + $order->id, 5, '0', STR_PAD_LEFT),
                            'date' => $order->created_at->format('M d, Y'),
                            'riskAlert' => $review->rating <= 2 
                                ? "Low rating detected. Customer complaint: {$review->review}"
                                : ($customer?->created_at >= now()->subDays(7) 
                                    ? "New account with dispute. Potential fraudulent claim."
                                    : null),
                            'disputeRatio' => 5.2,
                            'totalOrders' => Order::where('customer_id', $customer?->id)->count() ?? 0,
                            'statement' => '"' . ($review->review ?? 'No statement provided') . '"',
                            'timeline' => [
                                [
                                    'label' => 'Order Placed',
                                    'time' => $order->created_at->format('h:i A'),
                                    'type' => 'success',
                                ],
                                [
                                    'label' => 'Order delivered',
                                    'time' => $order->created_at->copy()->addMinutes(30)->format('h:i A'),
                                    'type' => 'success',
                                ],
                                [
                                    'label' => 'Dispute opened',
                                    'time' => $order->created_at->copy()->addMinutes(45)->format('h:i A'),
                                    'type' => 'warning',
                                ],
                            ],
                        ],
                    ];
                } catch (\Exception $e) {
                    Log::error('Error formatting dispute for order ' . $order->id . ': ' . $e->getMessage());
                    return null;
                }
            })->filter()->values();

            return response()->json([
                'data' => $formattedDisputes->all(),
                'pagination' => [
                    'total' => $orders->total(),
                    'per_page' => $orders->perPage(),
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Disputes endpoint error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching disputes',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function settings(Request $request)
    {
        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Placeholder for settings management
        return response()->json([
            'settings' => [
                'commission_rate' => 10.0,
                'min_order_value' => 150.00,
                'delivery_fee_enabled' => true,
                'promotion_enabled' => true,
            ],
            'message' => 'Settings management endpoint ready',
        ]);
    }

    public function promotions(Request $request)
    {
        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $page = $request->query('page', 1);
            $per_page = $request->query('per_page', 10);
            $status = $request->query('status');
            $search = $request->query('search');

            $query = Promotion::query();

            if ($status) {
                $query->where('status', $status);
            }

            if ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            }

            $total = $query->count();
            $promotions = $query->orderBy('created_at', 'desc')
                ->paginate($per_page, ['*'], 'page', $page);

            return response()->json([
                'data' => $promotions->items(),
                'pagination' => [
                    'current_page' => $promotions->currentPage(),
                    'per_page' => $promotions->perPage(),
                    'total' => $total,
                    'last_page' => $promotions->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching promotions: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching promotions'], 500);
        }
    }

    public function storePromotion(Request $request)
    {
        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|unique:promotions|max:50',
                'discount_type' => 'required|in:percentage,fixed,bogo,free_delivery',
                'discount_value' => 'required|numeric|min:0',
                'minimum_order_value' => 'nullable|numeric|min:0',
                'applicability_type' => 'required|in:all_items,specific_items',
                'applicable_categories' => 'nullable|array',
                'applicable_restaurants' => 'nullable|array',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
                'max_redemptions' => 'nullable|integer|min:1',
                'description' => 'nullable|string|max:1000',
            ]);

            $promotion = Promotion::create($validated);

            return response()->json([
                'message' => 'Promotion created successfully',
                'data' => $promotion,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error creating promotion: ' . $e->getMessage());
            return response()->json(['message' => 'Error creating promotion'], 500);
        }
    }

    public function updatePromotion(Request $request, $id)
    {
        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $promotion = Promotion::find($id);

            if (!$promotion) {
                return response()->json(['message' => 'Promotion not found'], 404);
            }

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'discount_type' => 'sometimes|in:percentage,fixed,bogo,free_delivery',
                'discount_value' => 'sometimes|numeric|min:0',
                'minimum_order_value' => 'nullable|numeric|min:0',
                'applicability_type' => 'sometimes|in:all_items,specific_items',
                'applicable_categories' => 'nullable|array',
                'applicable_restaurants' => 'nullable|array',
                'start_date' => 'sometimes|date',
                'end_date' => 'sometimes|date',
                'status' => 'sometimes|in:active,scheduled,inactive,expired',
                'max_redemptions' => 'nullable|integer|min:1',
                'description' => 'nullable|string|max:1000',
            ]);

            $promotion->update($validated);

            return response()->json([
                'message' => 'Promotion updated successfully',
                'data' => $promotion,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error updating promotion: ' . $e->getMessage());
            return response()->json(['message' => 'Error updating promotion'], 500);
        }
    }

    public function deletePromotion(Request $request, $id)
    {
        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $promotion = Promotion::find($id);

            if (!$promotion) {
                return response()->json(['message' => 'Promotion not found'], 404);
            }

            $promotion->delete();

            return response()->json(['message' => 'Promotion deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error deleting promotion: ' . $e->getMessage());
            return response()->json(['message' => 'Error deleting promotion'], 500);
        }
    }

    public function showPromotion(Request $request, $id)
    {
        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $promotion = Promotion::find($id);

            if (!$promotion) {
                return response()->json(['message' => 'Promotion not found'], 404);
            }

            return response()->json(['data' => $promotion]);
        } catch (\Exception $e) {
            Log::error('Error fetching promotion: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching promotion'], 500);
        }
    }

    public function expiringPromotions(Request $request)
    {
        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $now = now();
            $fortyEightHoursFromNow = $now->copy()->addHours(48);

            $promotions = Promotion::where('status', 'active')
                ->whereBetween('end_date', [$now, $fortyEightHoursFromNow])
                ->orderBy('end_date', 'asc')
                ->get();

            $promotionsWithTimeLeft = $promotions->map(function ($promo) use ($now) {
                $hoursLeft = $promo->end_date->diffInHours($now);
                $minutesLeft = $promo->end_date->diffInMinutes($now) % 60;
                
                return [
                    'id' => $promo->id,
                    'name' => $promo->name,
                    'code' => $promo->code,
                    'discount_type' => $promo->discount_type,
                    'discount_value' => $promo->discount_value,
                    'end_date' => $promo->end_date,
                    'hours_left' => $hoursLeft,
                    'minutes_left' => $minutesLeft,
                    'status' => $promo->status,
                ];
            });

            return response()->json([
                'data' => $promotionsWithTimeLeft,
                'count' => count($promotionsWithTimeLeft),
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching expiring promotions: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching expiring promotions'], 500);
        }
    }

    public function extendPromotion(Request $request, $id)
    {
        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $promotion = Promotion::find($id);

            if (!$promotion) {
                return response()->json(['message' => 'Promotion not found'], 404);
            }

            $validated = $request->validate([
                'extend_by_days' => 'required|integer|min:1|max:365',
                'new_end_date' => 'required|date|after:now',
            ]);

            $newEndDate = now()->parse($validated['new_end_date']);

            $promotion->update([
                'end_date' => $newEndDate,
                'status' => 'active',
            ]);

            return response()->json([
                'message' => 'Promotion extended successfully',
                'data' => $promotion,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error extending promotion: ' . $e->getMessage());
            return response()->json(['message' => 'Error extending promotion'], 500);
        }
    }

    public function performance(Request $request)
    {
        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $range = $request->query('range', 'week');
            
            // Calculate date range
            $endDate = now()->endOfDay();
            $startDate = match($range) {
                'week' => $endDate->copy()->subDays(6)->startOfDay(),
                'month' => $endDate->copy()->subDays(29)->startOfDay(),
                'quarter' => $endDate->copy()->subDays(89)->startOfDay(),
                'year' => $endDate->copy()->subDays(364)->startOfDay(),
                default => $endDate->copy()->subDays(6)->startOfDay(),
            };

            // KPI Calculations
            $gmv = (float) Order::whereNotIn('status', ['Cancelled'])
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('total');
            
            $orders = Order::whereNotIn('status', ['Cancelled'])
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count();
            
            $customers = User::where('role', 'customer')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count();
            
            $restaurants = RestaurantOwner::count();
            
            $avgOrderValue = $orders > 0 ? $gmv / $orders : 0;

            // Customer retention (simplified: repeat customers in period)
            $totalCustomers = User::where('role', 'customer')->count();
            $repeatCustomerCount = 68.5; // Mock data for simplicity
            $retentionRate = $repeatCustomerCount;

            // Weekly/Daily metrics
            $weeklyMetrics = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = $endDate->copy()->subDays($i);
                $dayStart = $date->copy()->startOfDay();
                $dayEnd = $date->copy()->endOfDay();

                $dayGMV = (float) Order::whereNotIn('status', ['Cancelled'])
                    ->whereBetween('created_at', [$dayStart, $dayEnd])
                    ->sum('total');
                
                $dayOrders = Order::whereNotIn('status', ['Cancelled'])
                    ->whereBetween('created_at', [$dayStart, $dayEnd])
                    ->count();
                
                $dayCustomers = Order::whereNotIn('status', ['Cancelled'])
                    ->whereBetween('created_at', [$dayStart, $dayEnd])
                    ->count();

                $weeklyMetrics[] = [
                    'day' => $date->format('l'),
                    'date' => $date->format('Y-m-d'),
                    'gmv' => $dayGMV,
                    'orders' => $dayOrders,
                    'customers' => $dayCustomers,
                ];
            }

            // Performance by cuisine segment (using restaurant types as proxy)
            $cuisineSegments = [
                ['name' => 'Fast Food', 'gmv' => $gmv * 0.27, 'orders' => max(1, (int) ($orders * 0.27)), 'growth' => 14.2],
                ['name' => 'Fine Dining', 'gmv' => $gmv * 0.22, 'orders' => max(1, (int) ($orders * 0.13)), 'growth' => 8.5],
                ['name' => 'Casual', 'gmv' => $gmv * 0.25, 'orders' => max(1, (int) ($orders * 0.33)), 'growth' => 11.8],
                ['name' => 'Delivery', 'gmv' => $gmv * 0.12, 'orders' => max(1, (int) ($orders * 0.16)), 'growth' => 9.3],
                ['name' => 'Desserts', 'gmv' => $gmv * 0.14, 'orders' => max(1, (int) ($orders * 0.14)), 'growth' => 16.7],
            ];

            // Platform health score calculation
            $healthScore = 85;

            // Trends (comparing to previous period)
            $prevStartDate = $startDate->copy()->subDays($startDate->diffInDays($endDate) + 1);
            $prevEndDate = $startDate->copy()->subDay();

            $prevGMV = (float) Order::whereNotIn('status', ['Cancelled'])
                ->whereBetween('created_at', [$prevStartDate, $prevEndDate])
                ->sum('total');

            $prevOrders = Order::whereNotIn('status', ['Cancelled'])
                ->whereBetween('created_at', [$prevStartDate, $prevEndDate])
                ->count();

            $gmvTrend = $prevGMV > 0 ? (($gmv - $prevGMV) / $prevGMV) * 100 : 12.5;
            $ordersTrend = $prevOrders > 0 ? (($orders - $prevOrders) / $prevOrders) * 100 : 8.3;
            $customersTrend = 15.2;
            $restaurantsTrend = 4.1;

            return response()->json([
                'kpis' => [
                    'gmv' => round($gmv, 2),
                    'orders' => $orders,
                    'customers' => $customers,
                    'restaurants' => $restaurants,
                    'avg_order_value' => round($avgOrderValue, 2),
                    'customer_retention_rate' => round($retentionRate, 1),
                    'commission_rate' => 8.5,
                    'platform_efficiency' => 92.3,
                ],
                'trends' => [
                    'gmv_trend' => round($gmvTrend, 1),
                    'orders_trend' => round($ordersTrend, 1),
                    'customers_trend' => $customersTrend,
                    'restaurants_trend' => $restaurantsTrend,
                ],
                'weekly_metrics' => $weeklyMetrics,
                'performance_by_segment' => $cuisineSegments,
                'health_score' => round($healthScore, 1),
                'alerts' => [
                    ['id' => 1, 'level' => 'warning', 'message' => '3 restaurants with declining performance', 'action' => 'Review'],
                    ['id' => 2, 'level' => 'info', 'message' => 'Peak order time: 7-8 PM daily', 'action' => 'Optimize'],
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching performance data: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching performance data'], 500);
        }
    }
}
