<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = \App\Models\Order::with('items')->orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'restaurant' => 'required|string',
            'subtotal' => 'required|numeric',
            'deliveryFee' => 'required|numeric',
            'discount' => 'required|numeric',
            'total' => 'required|numeric',
            'paymentMethod' => 'required|string',
            'deliveryAddress' => 'required|string',
            'contactNumber' => 'required|string',
            'specialInstructions' => 'nullable|string',
            'items' => 'required|array',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|integer',
            'items.*.price' => 'required|numeric',
            'items.*.image' => 'nullable|string',
            'items.*.variations' => 'nullable|array',
        ]);

        // Assuming authenticated user places the order. For now, we will create a dummy user id if not logged in.
        $userId = $request->user() ? $request->user()->id : 1;

        $order = \App\Models\Order::create([
            'customer_id' => $userId,
            'store_name' => $validated['restaurant'],
            'subtotal' => $validated['subtotal'],
            'delivery_fee' => $validated['deliveryFee'],
            'discount' => $validated['discount'],
            'total' => $validated['total'],
            'payment_method' => $validated['paymentMethod'],
            'delivery_address' => $validated['deliveryAddress'],
            'contact_number' => $validated['contactNumber'],
            'special_instructions' => $validated['specialInstructions'] ?? null,
            'status' => 'Pending',
        ]);

        foreach ($validated['items'] as $item) {
            $order->items()->create([
                'item_name' => $item['name'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'image' => $item['image'] ?? null,
                'variations' => $item['variations'] ?? null,
            ]);
        }

        return response()->json($order->load('items'), 201);
    }
}
