<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\RestaurantOwner;
use App\Models\Review;
use App\Models\User;
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
                return [
                    'id' => $owner->id,
                    'restaurant_name' => $owner->restaurant_name,
                    'location' => $owner->business_address,
                    'category' => collect($owner->cuisine_type)->join(', ') ?: 'General',
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

        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 10);
        $status = $request->query('status');

        $query = RestaurantOwner::query();

        $restaurants = $query->latest()->paginate($perPage, ['*'], 'page', $page);

        $restaurants->getCollection()->transform(function ($owner) {
            $totalOrders = Order::where('restaurant_owner_id', $owner->id)->count();
            $totalRevenue = Order::where('restaurant_owner_id', $owner->id)->sum('total');
            $commission = $totalRevenue * 0.10; // 10% commission
            $netPayout = $totalRevenue - $commission;

            return [
                'id' => $owner->id,
                'restaurant' => $owner->restaurant_name,
                'owner' => $owner->name,
                'total_sales' => round($totalRevenue, 2),
                'commission' => round($commission, 2),
                'net_payout' => round($netPayout, 2),
                'status' => 'Unpaid',
                'category' => collect($owner->cuisine_type)->first() ?? 'General',
                'logo' => $owner->logo,
                'location' => $owner->business_address,
                'branches' => 1,
                'last_updated' => optional(Order::where('restaurant_owner_id', $owner->id)->latest()->first())->created_at?->diffForHumans() ?? 'Never',
            ];
        });

        return response()->json([
            'data' => $restaurants->items(),
            'pagination' => [
                'total' => $restaurants->total(),
                'per_page' => $restaurants->perPage(),
                'current_page' => $restaurants->currentPage(),
                'last_page' => $restaurants->lastPage(),
            ],
        ]);
    }

    public function analytics(Request $request)
    {
        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $totalOrders = Order::count();
        $totalRevenue = Order::sum('total');
        $totalCustomers = User::where('role', 'customer')->count();
        $activeRestaurants = RestaurantOwner::where('operating_status', 'open')->count();
        $completedOrders = Order::where('status', 'Completed')->count();
        $cancelledOrders = Order::where('status', 'Cancelled')->count();

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
            $gross = Order::whereBetween('created_at', [$startDate, $endDate])->sum('total');
            $net = $gross * 0.9; // 90% after 10% commission

            return [
                'label' => $startDate->format('M j') . '-' . $endDate->format('j'),
                'gross' => round($gross, 2),
                'net' => round($net, 2),
            ];
        })->values();

        // Top restaurants
        $topRestaurants = RestaurantOwner::get()
            ->map(function ($owner) {
                $orders = Order::where('restaurant_owner_id', $owner->id)->count();
                $rating = Review::where('restaurant_owner_id', $owner->id)->avg('rating') ?? 0;
                $revenue = Order::where('restaurant_owner_id', $owner->id)->sum('total');
                $commission = $revenue * 0.10;

                return [
                    'name' => $owner->restaurant_name,
                    'orders' => $orders,
                    'rating' => round($rating, 1),
                    'commission' => round($commission, 2),
                    'status' => 'Active',
                ];
            })
            ->sortByDesc('orders')
            ->take(5)
            ->values();

        return response()->json([
            'stats' => [
                'total_orders' => $totalOrders,
                'total_revenue' => round($totalRevenue, 2),
                'active_customers' => $totalCustomers,
                'active_restaurants' => $activeRestaurants,
                'avg_order_value' => $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0,
            ],
            'orders_chart' => $ordersChartData,
            'revenue_chart' => $revenueChartData,
            'top_restaurants' => $topRestaurants,
        ]);
    }

    public function disputes(Request $request)
    {
        $admin = $request->user();

        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Placeholder for disputes - can be expanded later when Dispute model is created
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 10);

        return response()->json([
            'data' => [],
            'pagination' => [
                'total' => 0,
                'per_page' => $perPage,
                'current_page' => $page,
                'last_page' => 0,
            ],
        ]);
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
}
