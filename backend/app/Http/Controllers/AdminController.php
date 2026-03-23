<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\RestaurantOwner;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
}
