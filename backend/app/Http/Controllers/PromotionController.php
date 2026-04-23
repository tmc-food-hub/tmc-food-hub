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

        // Find the active promotion by code
        $promo = Promotion::active()->where('code', $validated['code'])->first();

        if (!$promo) {
            return response()->json(['message' => 'Invalid or expired promotion code.'], 400);
        }

        // Check applicable_restaurants if it's not null or empty
        $applicableRestaurants = $promo->applicable_restaurants;
        if (!empty($applicableRestaurants) && !in_array($validated['restaurant_id'], $applicableRestaurants)) {
            return response()->json(['message' => 'This promotion is not valid for this restaurant.'], 400);
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
            $discountAmount = 0; // The frontend will handle zeroing delivery fee based on this type, but for simple logic we can return discount_value = 0 and type = free_delivery
        }

        // Ensure discount doesn't exceed subtotal (unless it's free delivery)
        if ($discountAmount > $validated['subtotal']) {
            $discountAmount = $validated['subtotal'];
        }

        return response()->json([
            'message' => 'Promotion applied successfully!',
            'promotion' => [
                'id' => $promo->id,
                'code' => $promo->code,
                'discount_type' => $promo->discount_type,
                'discount_value' => $promo->discount_value,
                'calculated_discount' => round($discountAmount, 2),
            ]
        ]);
    }
}
