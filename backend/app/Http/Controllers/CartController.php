<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function show(Request $request)
    {
        $cart = $request->user()->cart;

        return response()->json([
            'items' => $cart?->items ?? [],
            'updated_at' => optional($cart?->updated_at)?->toISOString(),
        ]);
    }

    public function sync(Request $request)
    {
        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.cartItemId' => ['nullable', 'string', 'max:255'],
            'items.*.id' => ['required', 'integer', 'exists:menu_items,id'],
            'items.*.title' => ['required', 'string', 'max:255'],
            'items.*.image' => ['nullable', 'string'],
            'items.*.price' => ['required', 'numeric', 'min:0'],
            'items.*.originalPrice' => ['nullable', 'numeric', 'min:0'],
            'items.*.storeName' => ['required', 'string', 'max:255'],
            'items.*.restaurantId' => ['required', 'integer', 'exists:restaurant_owners,id'],
            'items.*.variation' => ['nullable', 'array'],
            'items.*.addOns' => ['nullable', 'array'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        $items = $validated['items'];

        if (count($items) > 0) {
            $restaurantIds = collect($items)->pluck('restaurantId')->unique()->values();
            if ($restaurantIds->count() > 1) {
                return response()->json([
                    'message' => 'Cart items must belong to a single restaurant.',
                ], 422);
            }

            $menuItems = MenuItem::whereIn('id', collect($items)->pluck('id')->all())
                ->get()
                ->keyBy('id');

            foreach ($items as $item) {
                $menuItem = $menuItems->get($item['id']);

                if (!$menuItem || (int) $menuItem->restaurant_owner_id !== (int) $item['restaurantId']) {
                    return response()->json([
                        'message' => "Cart item '{$item['title']}' does not belong to the selected restaurant.",
                    ], 422);
                }
            }
        }

        $cart = Cart::updateOrCreate(
            ['user_id' => $request->user()->id],
            ['items' => $items]
        );

        return response()->json([
            'message' => 'Cart synced successfully.',
            'items' => $cart->items ?? [],
            'updated_at' => optional($cart->updated_at)?->toISOString(),
        ]);
    }

    public function clear(Request $request)
    {
        Cart::updateOrCreate(
            ['user_id' => $request->user()->id],
            ['items' => []]
        );

        return response()->json([
            'message' => 'Cart cleared successfully.',
            'items' => [],
        ]);
    }
}
