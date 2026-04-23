<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Promotion;
use App\Models\Order;
use Illuminate\Support\Carbon;

class PromotionController extends Controller
{
    /**
     * Apply a promotion code to the cart.
     */
    public function apply(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
            'restaurant_id' => 'required|integer',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $code = strtoupper(trim($validated['code']));
        $restaurantId = (int) $validated['restaurant_id'];

        // Find promotion by code that is active and within date range
        $promo = Promotion::where('code', $code)
            ->where('status', 'active')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->first();

        if (!$promo) {
            return response()->json(['message' => 'Invalid or expired promotion code.'], 400);
        }

        // Check applicable_restaurants — match both int and string IDs
        $applicableRestaurants = $promo->applicable_restaurants;
        if (!empty($applicableRestaurants)) {
            $restaurantIds = array_map('intval', $applicableRestaurants);
            if (!in_array($restaurantId, $restaurantIds, true)) {
                return response()->json(['message' => 'This promotion is not valid for this restaurant.'], 400);
            }
        }

        // Check minimum order value
        if ($promo->minimum_order_value > 0 && $validated['subtotal'] < $promo->minimum_order_value) {
            return response()->json([
                'message' => 'Minimum order amount for this promotion is $' . number_format($promo->minimum_order_value, 2)
            ], 400);
        }

        // Check max redemptions
        if ($promo->max_redemptions !== null && $promo->redemptions_count >= $promo->max_redemptions) {
            return response()->json(['message' => 'This promotion has reached its maximum redemptions.'], 400);
        }

        // Calculate discount
        $discountAmount = 0;
        if ($promo->discount_type === 'percentage') {
            $discountAmount = ($promo->discount_value / 100) * $validated['subtotal'];
        } elseif ($promo->discount_type === 'fixed') {
            $discountAmount = $promo->discount_value;
        } elseif ($promo->discount_type === 'free_delivery') {
            // Frontend will zero out the delivery fee
            $discountAmount = 0;
        }

        // Ensure discount doesn't exceed subtotal
        if ($discountAmount > $validated['subtotal']) {
            $discountAmount = $validated['subtotal'];
        }

        return response()->json([
            'message' => 'Promotion applied successfully!',
            'promotion' => [
                'id' => $promo->id,
                'code' => $promo->code,
                'name' => $promo->name,
                'discount_type' => $promo->discount_type,
                'discount_value' => $promo->discount_value,
                'calculated_discount' => round($discountAmount, 2),
            ]
        ]);
    }
}
