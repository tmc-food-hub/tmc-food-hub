<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Order::with(['items', 'customer'])->orderBy('created_at', 'desc');

        if ($user->role === 'customer') {
            $query->where('customer_id', $user->id);
        } elseif ($user->role === 'partner') {
            $query->where('store_name', $user->restaurant_name);
        }

        $orders = $query->get();
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

        $userId = $request->user()->id;

        $order = Order::create([
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
            'status' => 'Order Placed',
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

        Log::info('Order placed successfully', ['order_id' => $order->id]);
        return response()->json($order->load('items'), 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string',
        ]);

        $order = Order::findOrFail($id);
        
        // Ensure the store can only update its own orders
        if ($request->user()->role === 'partner' && $order->store_name !== $request->user()->restaurant_name) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order->update(['status' => $validated['status']]);

        return response()->json($order);
    }
}
