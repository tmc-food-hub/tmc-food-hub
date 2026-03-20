<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\RestaurantOwner;
use App\Models\Review;
use App\Models\ReviewHelpfulVote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReviewController extends Controller
{
    public function index(Request $request, int $restaurantId)
    {
        $sort = $request->query('sort', 'recent');
        $withPhotos = filter_var($request->query('with_photos', false), FILTER_VALIDATE_BOOLEAN);
        $verifiedOnly = filter_var($request->query('verified_only', false), FILTER_VALIDATE_BOOLEAN);

        $baseQuery = Review::with(['customer:id,name,first_name,last_name', 'order.items'])
            ->where('restaurant_owner_id', $restaurantId);

        if ($withPhotos) {
            $baseQuery->whereNotNull('photos')->whereJsonLength('photos', '>', 0);
        }

        if ($verifiedOnly) {
            $baseQuery->where('is_verified', true);
        }

        if ($sort === 'highest_rated') {
            $baseQuery->orderByDesc('rating')->orderByDesc('created_at');
        } else {
            $baseQuery->orderByDesc('created_at');
        }

        $reviews = $baseQuery->get();
        $summary = $this->buildSummary($restaurantId);

        return response()->json([
            'summary' => $summary,
            'reviews' => $reviews->map(fn (Review $review) => $this->formatReview($review)),
        ]);
    }

    public function reviewableOrders(Request $request, int $restaurantId)
    {
        $user = $request->user();

        if (!$user || $user instanceof RestaurantOwner || $user->role !== 'customer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $orders = Order::with('items')
            ->where('customer_id', $user->id)
            ->where('restaurant_owner_id', $restaurantId)
            ->where('status', 'Delivered')
            ->whereDoesntHave('review')
            ->latest()
            ->get();

        return response()->json([
            'orders' => $orders->map(function (Order $order) {
                return [
                    'id' => $order->id,
                    'order_number' => $this->buildOrderNumber($order),
                    'delivered_at' => optional($order->updated_at)->toIso8601String(),
                    'items' => $order->items->map(fn ($item) => [
                        'id' => $item->id,
                        'name' => $item->item_name,
                        'image' => $item->image,
                    ])->values(),
                ];
            })->values(),
        ]);
    }

    public function store(Request $request, int $restaurantId)
    {
        $user = $request->user();

        if (!$user || $user instanceof RestaurantOwner || $user->role !== 'customer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'order_id' => 'required|integer|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'required|string|min:10|max:1500',
            'photo_files' => 'nullable|array|max:3',
            'photo_files.*' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
        ]);

        $order = Order::with('items')
            ->where('id', $validated['order_id'])
            ->where('customer_id', $user->id)
            ->where('restaurant_owner_id', $restaurantId)
            ->where('status', 'Delivered')
            ->first();

        if (!$order) {
            throw ValidationException::withMessages([
                'order_id' => ['You can only review delivered orders from this restaurant.'],
            ]);
        }

        if (Review::where('order_id', $order->id)->exists()) {
            throw ValidationException::withMessages([
                'order_id' => ['This order has already been reviewed.'],
            ]);
        }

        $photoPaths = [];
        if ($request->hasFile('photo_files')) {
            foreach ($request->file('photo_files') as $photo) {
                $path = $photo->store('reviews', 'public');
                $photoPaths[] = asset('storage/' . $path);
            }
        }

        $review = Review::create([
            'restaurant_owner_id' => $restaurantId,
            'customer_id' => $user->id,
            'order_id' => $order->id,
            'rating' => $validated['rating'],
            'review' => trim($validated['review']),
            'photos' => $photoPaths,
            'is_verified' => true,
        ]);

        return response()->json([
            'message' => 'Review submitted successfully.',
            'review' => $this->formatReview($review->load(['customer', 'order.items'])),
            'summary' => $this->buildSummary($restaurantId),
        ], 201);
    }

    public function toggleHelpful(Request $request, int $reviewId)
    {
        $user = $request->user();

        if (!$user || $user instanceof RestaurantOwner || $user->role !== 'customer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $review = Review::findOrFail($reviewId);

        $vote = ReviewHelpfulVote::where('review_id', $review->id)
            ->where('user_id', $user->id)
            ->first();

        if ($vote) {
            $vote->delete();
            $review->helpful_count = max(0, $review->helpful_count - 1);
            $helpful = false;
        } else {
            ReviewHelpfulVote::create([
                'review_id' => $review->id,
                'user_id' => $user->id,
            ]);
            $review->helpful_count += 1;
            $helpful = true;
        }

        $review->save();

        return response()->json([
            'helpful' => $helpful,
            'helpful_count' => $review->helpful_count,
        ]);
    }

    public function ownerIndex(Request $request)
    {
        $owner = $request->user();

        if (!$owner instanceof RestaurantOwner) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $reviews = Review::with(['customer:id,name,first_name,last_name', 'order.items'])
            ->where('restaurant_owner_id', $owner->id)
            ->orderByRaw('CASE WHEN owner_reply IS NULL THEN 0 ELSE 1 END')
            ->orderByDesc('created_at')
            ->get();

        $summary = $this->buildSummary($owner->id);
        $summary['awaiting_reply'] = $reviews->whereNull('owner_reply')->count();

        return response()->json([
            'summary' => $summary,
            'reviews' => $reviews->map(fn (Review $review) => $this->formatReview($review)),
        ]);
    }

    public function reply(Request $request, int $reviewId)
    {
        $owner = $request->user();

        if (!$owner instanceof RestaurantOwner) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'owner_reply' => 'required|string|min:3|max:1000',
        ]);

        $review = Review::where('restaurant_owner_id', $owner->id)->findOrFail($reviewId);
        $review->update([
            'owner_reply' => trim($validated['owner_reply']),
            'owner_replied_at' => now(),
        ]);

        return response()->json([
            'message' => 'Reply posted successfully.',
            'review' => $this->formatReview($review->fresh(['customer', 'order.items'])),
        ]);
    }

    private function buildSummary(int $restaurantId): array
    {
        $aggregate = Review::where('restaurant_owner_id', $restaurantId)
            ->selectRaw('COUNT(*) as total_reviews, COALESCE(AVG(rating), 0) as average_rating')
            ->first();

        $distributionRaw = Review::where('restaurant_owner_id', $restaurantId)
            ->select('rating', DB::raw('COUNT(*) as count'))
            ->groupBy('rating')
            ->pluck('count', 'rating');

        $total = (int) ($aggregate->total_reviews ?? 0);
        $distribution = [];

        for ($rating = 5; $rating >= 1; $rating--) {
            $count = (int) ($distributionRaw[$rating] ?? 0);
            $distribution[] = [
                'rating' => $rating,
                'count' => $count,
                'percentage' => $total > 0 ? round(($count / $total) * 100, 1) : 0,
            ];
        }

        return [
            'average_rating' => round((float) ($aggregate->average_rating ?? 0), 1),
            'total_reviews' => $total,
            'five_star_reviews' => (int) ($distributionRaw[5] ?? 0),
            'distribution' => $distribution,
        ];
    }

    private function formatReview(Review $review): array
    {
        $customerName = trim(($review->customer->first_name ?? '') . ' ' . ($review->customer->last_name ?? ''));
        $customerName = $customerName ?: ($review->customer->name ?? 'Anonymous Customer');
        $parts = preg_split('/\s+/', trim($customerName)) ?: [];
        $initials = collect($parts)->take(2)->map(fn ($part) => strtoupper(substr($part, 0, 1)))->implode('');

        return [
            'id' => $review->id,
            'rating' => $review->rating,
            'review' => $review->review,
            'photos' => $review->photos ?? [],
            'helpful_count' => $review->helpful_count,
            'is_verified' => $review->is_verified,
            'customer_name' => $customerName,
            'customer_initials' => $initials ?: 'CU',
            'created_at' => optional($review->created_at)->toIso8601String(),
            'created_at_human' => optional($review->created_at)->diffForHumans(),
            'created_at_label' => optional($review->created_at)->format('M j, Y'),
            'owner_reply' => $review->owner_reply,
            'owner_replied_at' => optional($review->owner_replied_at)->toIso8601String(),
            'owner_replied_at_human' => optional($review->owner_replied_at)->diffForHumans(),
            'order_number' => $this->buildOrderNumber($review->order),
            'order_items' => $review->order?->items->map(fn ($item) => [
                'name' => $item->item_name,
                'image' => $item->image,
            ])->values() ?? [],
        ];
    }

    private function buildOrderNumber(?Order $order): ?string
    {
        if (!$order) {
            return null;
        }

        $prefix = collect(explode(' ', $order->store_name))
            ->filter()
            ->map(fn ($part) => strtoupper(substr($part, 0, 1)))
            ->implode('');

        $prefix = strlen($prefix) === 1 ? strtoupper(substr($order->store_name, 0, 2)) : $prefix;

        return sprintf('%s-%04d', $prefix ?: 'OD', $order->id);
    }
}
