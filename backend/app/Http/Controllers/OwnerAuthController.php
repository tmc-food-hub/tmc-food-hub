<?php

namespace App\Http\Controllers;

use App\Mail\OtpVerificationMail;
use App\Models\EmailVerification;
use App\Models\RestaurantOwner;
use App\Support\MediaPath;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OwnerAuthController extends Controller
{
    /**
     * Send a 6-digit OTP to the provided email for owner registration.
     */
    public function sendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $email = $request->email;

        if (RestaurantOwner::where('email', $email)->exists()) {
            throw ValidationException::withMessages([
                'email' => ['This email is already registered as a restaurant owner.'],
            ]);
        }

        $rateLimitKey = 'owner-send-otp:' . $email;
        if (RateLimiter::tooManyAttempts($rateLimitKey, 5)) {
            $seconds = RateLimiter::availableIn($rateLimitKey);
            return response()->json(['message' => "Too many attempts. Try again in {$seconds} seconds."], 429);
        }
        RateLimiter::hit($rateLimitKey, 3600);

        $otp = (string)random_int(100000, 999999);

        EmailVerification::where('email', $email)->delete();
        EmailVerification::create([
            'email'      => $email,
            'otp'        => Hash::make($otp),
            'attempts'   => 0,
            'expires_at' => now()->addMinutes(10),
            'created_at' => now(),
        ]);

        Mail::to($email)->send(new OtpVerificationMail($otp));

        return response()->json(['message' => 'Verification code sent to your email.']);
    }

    /**
     * Verify the owner OTP and return an encrypted verification token.
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp'   => 'required|string|size:6',
        ]);

        $record = EmailVerification::where('email', $request->email)->first();

        if (!$record) {
            throw ValidationException::withMessages(['otp' => ['No verification code found. Please request a new one.']]);
        }

        if ($record->expires_at->isPast()) {
            $record->delete();
            throw ValidationException::withMessages(['otp' => ['Verification code has expired. Please request a new one.']]);
        }

        if ($record->attempts >= 5) {
            $record->delete();
            throw ValidationException::withMessages(['otp' => ['Too many failed attempts. Please request a new code.']]);
        }

        if (!Hash::check($request->otp, $record->otp)) {
            $record->increment('attempts');
            $remaining = 5 - $record->attempts;
            throw ValidationException::withMessages(['otp' => ["Invalid verification code. {$remaining} attempt(s) remaining."]]);
        }

        $record->delete();

        $verificationToken = Crypt::encryptString(json_encode([
            'email'       => $request->email,
            'verified_at' => now()->toIso8601String(),
            'expires_at'  => now()->addMinutes(30)->toIso8601String(),
        ]));

        return response()->json([
            'message'                  => 'Email verified successfully.',
            'email_verification_token' => $verificationToken,
        ]);
    }

    /**
     * Handle login and return a Sanctum token for owners.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $owner = RestaurantOwner::where('email', $request->email)->first();

        if (!$owner || !Hash::check($request->password, $owner->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $owner->createToken('owner-auth-token')->plainTextToken;

        return response()->json([
            'user' => $owner,
            'token' => $token,
        ]);
    }

    /**
     * Handle registration for owners and return a Sanctum token.
     */
    public function register(Request $request)
    {
        // Validate the email verification token
        $request->validate([
            'email_verification_token' => 'required|string',
        ]);

        try {
            $tokenData = json_decode(Crypt::decryptString($request->email_verification_token), true);
        }
        catch (\Exception $e) {
            throw ValidationException::withMessages([
                'email' => ['Email verification is invalid. Please verify your email again.'],
            ]);
        }

        // Check token expiry
        if (now()->greaterThan($tokenData['expires_at'])) {
            throw ValidationException::withMessages([
                'email' => ['Email verification has expired. Please verify your email again.'],
            ]);
        }

        // Check token email matches registration email
        if ($tokenData['email'] !== $request->email) {
            throw ValidationException::withMessages([
                'email' => ['Email verification does not match. Please verify your email again.'],
            ]);
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:restaurant_owners,email',
            'password' => 'required|string|min:8|confirmed',
            'restaurant_name' => 'required|string|max:255',
            'business_address' => 'required|string|max:500',
            'business_contact_number' => 'required|string|max:20',
            'business_permit' => 'required|string|max:255',
            'terms_accepted' => 'accepted',
            'privacy_accepted' => 'accepted',
            'merchant_agreement_accepted' => 'accepted',
        ]);

        $owner = RestaurantOwner::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'phone' => $request->phone ?? null,
            'address' => $request->address ?? null,
            'restaurant_name' => $validated['restaurant_name'],
            'business_address' => $validated['business_address'],
            'business_contact_number' => $validated['business_contact_number'],
            'business_permit' => $validated['business_permit'],
            'email_verified_at' => now(),
        ]);

        $token = $owner->createToken('owner-auth-token')->plainTextToken;

        return response()->json([
            'user' => $owner,
            'token' => $token,
        ], 201);
    }

    /**
     * Return the authenticated owner.
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Update the authenticated owner's profile.
     */
    public function updateProfile(Request $request)
    {
        $owner = $request->user();

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'restaurant_name' => ['required', 'string', 'max:255'],
            'business_address' => 'required|string|max:500',
            'business_contact_number' => ['required', 'string', 'max:20'],
            'business_permit' => 'nullable|string|max:255',
            'business_registration_number' => 'nullable|string|max:255',
            'cuisine_type' => 'nullable|array',
            'cuisine_type.*' => 'string|max:50',
            'price_range' => 'nullable|string|max:10',
            'logo_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
            'cover_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:10240',
        ]);

        $data = $request->except(['logo_file', 'cover_file']);
        $data['name'] = $validated['first_name'] . ' ' . $validated['last_name'];

        if ($request->hasFile('logo_file')) {
            $path = $request->file('logo_file')->store('restaurants/logos', 'public');
            $data['logo'] = MediaPath::normalizeStoredPath($path);
        }

        if ($request->hasFile('cover_file')) {
            $path = $request->file('cover_file')->store('restaurants/covers', 'public');
            $data['cover_image'] = MediaPath::normalizeStoredPath($path);
        }

        $owner->update($data);

        return response()->json($owner->fresh());
    }

    /**
     * Update store operation preferences for the authenticated owner.
     */
    public function updateStoreOperations(Request $request)
    {
        $owner = $request->user();

        $validated = $request->validate([
            'operating_status' => ['required', 'string', 'in:open,paused,closed'],
            'auto_accept_orders' => ['required', 'boolean'],
            'manual_confirmation' => ['required', 'boolean'],
            'default_prep_time' => ['required', 'integer', 'in:10,15,20,30'],
        ]);

        $owner->update($validated);

        return response()->json($owner->fresh());
    }

    /**
     * Refresh the current token by revoking it and issuing a new one.
     */
    public function refreshToken(Request $request)
    {
        $owner = $request->user();

        $owner->currentAccessToken()->delete();

        $newToken = $owner->createToken('owner-auth-token')->plainTextToken;

        return response()->json([
            'user' => $owner,
            'token' => $newToken,
        ]);
    }

    /**
     * Revoke the current token (logout).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    /**
     * Owner analytics — aggregate order data for dashboard charts.
     */
    public function analytics(Request $request)
    {
        $owner = $request->user();
        $ownerId = $owner->id;
        $days = (int) $request->query('days', 30);

        $now = now();
        $startDate = $now->copy()->subDays($days)->startOfDay();
        $prevStartDate = $startDate->copy()->subDays($days);

        // All orders in current period
        $orders = \App\Models\Order::with('customer')->where('restaurant_owner_id', $ownerId)
            ->where('created_at', '>=', $startDate)
            ->get();

        // Previous period orders (for comparison)
        $prevOrders = \App\Models\Order::where('restaurant_owner_id', $ownerId)
            ->where('created_at', '>=', $prevStartDate)
            ->where('created_at', '<', $startDate)
            ->get();

        // All-time orders for total earnings
        $allOrders = \App\Models\Order::where('restaurant_owner_id', $ownerId)->get();

        // ── Metrics ──────────────────────────────────────────────────────
        $deliveredOrders = $orders->where('status', 'Delivered');
        $pendingOrders = $orders->whereIn('status', ['Pending', 'Order Confirmed', 'Out for Delivery']);
        $allDelivered = $allOrders->where('status', 'Delivered');

        $totalRevenue = $deliveredOrders->sum('total');
        $pendingRevenue = $pendingOrders->sum('total');
        $allTimeRevenue = $allDelivered->sum('total');
        $prevRevenue = $prevOrders->where('status', 'Delivered')->sum('total');
        $revenueTrend = $prevRevenue > 0 ? round((($totalRevenue - $prevRevenue) / $prevRevenue) * 100, 1) : 0;

        $totalOrdersCount = $orders->count();
        $prevOrdersCount = $prevOrders->count();
        $ordersTrend = $prevOrdersCount > 0 ? round((($totalOrdersCount - $prevOrdersCount) / $prevOrdersCount) * 100, 1) : 0;

        $avgOrderValue = $totalOrdersCount > 0 ? round($totalRevenue / $totalOrdersCount, 2) : 0;
        $prevAvg = $prevOrdersCount > 0 ? round($prevRevenue / $prevOrdersCount, 2) : 0;
        $avgTrend = $prevAvg > 0 ? round((($avgOrderValue - $prevAvg) / $prevAvg) * 100, 1) : 0;

        // Unique customers
        $newCustomers = $orders->pluck('customer_id')->unique()->count();
        $prevCustomers = $prevOrders->pluck('customer_id')->unique()->count();
        $customersTrend = $prevCustomers > 0 ? round((($newCustomers - $prevCustomers) / $prevCustomers) * 100, 1) : 0;

        // ── Daily Revenue (bar chart) ────────────────────────────────────
        $dailyRevenue = [];
        for ($i = 0; $i < $days; $i++) {
            $date = $startDate->copy()->addDays($i);
            $dayOrders = $orders->filter(function ($o) use ($date) {
                return $o->created_at->format('Y-m-d') === $date->format('Y-m-d') && $o->status === 'Delivered';
            });
            $dayAllOrders = $orders->filter(function ($o) use ($date) {
                return $o->created_at->format('Y-m-d') === $date->format('Y-m-d');
            });
            $dailyRevenue[] = [
                'date' => $date->format('M d, Y'),
                'day' => $date->format('M d'),
                'revenue' => round($dayOrders->sum('total'), 2),
                'orders' => $dayAllOrders->count(),
            ];
        }

        // ── Top Selling Items ────────────────────────────────────────────
        $orderIds = $deliveredOrders->pluck('id');
        $topItems = \App\Models\OrderItem::whereIn('order_id', $orderIds)
            ->select('item_name', 'image',
                DB::raw('SUM(quantity) as total_qty'),
                DB::raw('SUM(price * quantity) as total_revenue'))
            ->groupBy('item_name', 'image')
            ->orderByDesc('total_revenue')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->item_name,
                    'image' => $item->image,
                    'orders' => (int) $item->total_qty,
                    'revenue' => round((float) $item->total_revenue, 2),
                ];
            });

        // ── Order Patterns Heatmap (hour × day-of-week) ──────────────────
        $heatmap = [];
        $dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        $hours = [10, 12, 14, 16, 18, 20, 22];
        foreach ($dayNames as $dayName) {
            $row = ['day' => $dayName, 'data' => []];
            foreach ($hours as $hour) {
                $count = $orders->filter(function ($o) use ($dayName, $hour) {
                    $orderDay = $o->created_at->format('D');
                    $orderHour = (int) $o->created_at->format('G');
                    return $orderDay === $dayName && $orderHour >= $hour && $orderHour < ($hour + 2);
                })->count();
                $row['data'][] = $count;
            }
            $heatmap[] = $row;
        }
        // Normalize heatmap to 0-4 scale
        $allHeatValues = [];
        foreach ($heatmap as $r) {
            foreach ($r['data'] as $v) {
                $allHeatValues[] = $v;
            }
        }
        $maxHeat = count($allHeatValues) > 0 ? max($allHeatValues) : 1;
        if ($maxHeat < 1) $maxHeat = 1;
        foreach ($heatmap as &$row) {
            $row['data'] = array_map(function ($v) use ($maxHeat) {
                return (int) round(($v / $maxHeat) * 4);
            }, $row['data']);
        }

        // ── Recent High Value Orders ─────────────────────────────────────
        $highValueOrders = $orders->sortByDesc('total')->take(4)->map(function ($o) {
            return [
                'id' => '#' . str_pad($o->id, 4, '0', STR_PAD_LEFT),
                'customer' => $o->customer ? ($o->customer->first_name . ' ' . $o->customer->last_name) : 'Guest',
                'avatar' => null,
                'total' => round((float) $o->total, 2),
                'status' => $o->status,
            ];
        })->values();

        // ── Revenue Breakdown ────────────────────────────────────────────
        $totalFoodSales = $deliveredOrders->sum('subtotal');
        $platformFees = round($totalFoodSales * 0.15, 2); // 15% platform fee
        $taxes = round($totalFoodSales * 0.05, 2); // 5% tax
        $netRevenue = round($totalFoodSales - $platformFees - $taxes, 2);

        return response()->json([
            'metrics' => [
                'total_revenue' => round($totalRevenue, 2),
                'revenue_trend' => $revenueTrend,
                'prev_revenue' => round($prevRevenue, 2),
                'pending_revenue' => round($pendingRevenue, 2),
                'all_time_revenue' => round($allTimeRevenue, 2),
                'total_orders' => $totalOrdersCount,
                'orders_trend' => $ordersTrend,
                'prev_orders' => $prevOrdersCount,
                'avg_order_value' => $avgOrderValue,
                'avg_trend' => $avgTrend,
                'new_customers' => $newCustomers,
                'customers_trend' => $customersTrend,
                'prev_customers' => $prevCustomers,
            ],
            'revenue_breakdown' => [
                'food_sales' => round($totalFoodSales, 2),
                'platform_fees' => $platformFees,
                'taxes' => $taxes,
                'net_revenue' => $netRevenue,
            ],
            'daily_revenue' => $dailyRevenue,
            'top_items' => $topItems,
            'heatmap' => $heatmap,
            'high_value_orders' => $highValueOrders,
        ]);
    }

    /**
     * Get the owner's payment settings.
     */
    public function getPaymentSettings(Request $request)
    {
        $owner = $request->user();

        return response()->json([
            'accepted_payment_methods' => $owner->accepted_payment_methods ?? ['cod'],
            'gcash_number' => $owner->gcash_number,
            'maya_number' => $owner->maya_number,
            'bank_name' => $owner->bank_name,
            'bank_account_name' => $owner->bank_account_name,
            'bank_account_number' => $owner->bank_account_number,
        ]);
    }

    /**
     * Update the owner's payment settings.
     */
    public function updatePaymentSettings(Request $request)
    {
        $owner = $request->user();

        $validated = $request->validate([
            'accepted_payment_methods' => 'required|array|min:1',
            'accepted_payment_methods.*' => 'string|in:cod,gcash,maya,bank_transfer',
            'gcash_number' => 'nullable|string|max:20',
            'maya_number' => 'nullable|string|max:20',
            'bank_name' => 'nullable|string|max:100',
            'bank_account_name' => 'nullable|string|max:255',
            'bank_account_number' => 'nullable|string|max:50',
        ]);

        $owner->update($validated);

        return response()->json(['message' => 'Payment settings updated successfully']);
    }
}
