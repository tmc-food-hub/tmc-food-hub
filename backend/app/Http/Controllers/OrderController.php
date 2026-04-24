<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\RestaurantOwner;
use App\Models\MenuItem;
use App\Support\MediaPath;
use App\Support\PublicUpload;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Fetch orders for the authenticated user.
     *
     * - Customer (User model with role='customer'): sees only their own orders.
     * - Restaurant Owner (RestaurantOwner model): sees only orders assigned to them by ID.
     * - Secure fallback: any unrecognised actor gets a 403.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Order::with(['items', 'customer'])->orderBy('created_at', 'desc');

        if ($user instanceof RestaurantOwner) {
            // Owner sees only orders targeted at their restaurant by FK
            $query->where('restaurant_owner_id', $user->id);
        } elseif ($user->role === 'customer') {
            // Customer sees only their own placed orders
            $query->where('customer_id', $user->id);
        } else {
            // Block unrecognised roles from seeing any orders
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $orders = $query->get();
        return response()->json($orders);
    }

    /**
     * Place a new order.
     * Requires restaurantId to link order to the correct restaurant owner by FK.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'restaurant'           => 'required|string',
            'restaurantId'         => 'required|integer|exists:restaurant_owners,id',
            'subtotal'             => 'required|numeric|min:0',
            'deliveryFee'          => 'required|numeric|min:0',
            'discount'             => 'required|numeric|min:0',
            'total'                => 'required|numeric|min:0',
            'paymentMethod'        => 'required|string',
            'deliveryAddress'      => 'required|string',
            'contactNumber'        => 'required|string',
            'specialInstructions'  => 'nullable|string',
            'deliveryType'         => 'required|string|in:asap,scheduled',
            'scheduledDate'        => 'nullable|required_if:deliveryType,scheduled|date|after_or_equal:today',
            'scheduledTime'        => 'nullable|required_if:deliveryType,scheduled|string',
            'items'                => 'required|array|min:1',
            'items.*.id'           => 'required|integer|exists:menu_items,id',
            'items.*.name'         => 'required|string',
            'items.*.quantity'     => 'required|integer|min:1',
            'items.*.price'        => 'required|numeric|min:0',
            'items.*.image'        => 'nullable|string',
            'items.*.variations'   => 'nullable|array',
            'promo_code'           => 'nullable|string',
        ]);

        $userId = $request->user()->id;
        $owner = RestaurantOwner::findOrFail($validated['restaurantId']);

        if ($owner->operating_status !== 'open') {
            $message = match ($owner->operating_status) {
                'paused' => 'This restaurant has temporarily paused orders. Please try again shortly.',
                'closed' => 'This restaurant is currently closed and not accepting orders.',
                default => 'This restaurant is not accepting orders right now.',
            };

            return response()->json(['message' => $message], 422);
        }

        return DB::transaction(function () use ($validated, $userId, $owner, $request) {
            $promotionId = null;
            if (!empty($validated['promo_code'])) {
                $promo = \App\Models\Promotion::where('code', $validated['promo_code'])->active()->first();
                if ($promo) {
                    $promotionId = $promo->id;
                    $promo->increment('redemptions_count');
                }
            }

            $order = Order::create([
                'customer_id'          => $userId,
                'restaurant_owner_id'  => $validated['restaurantId'],
                'store_name'           => $validated['restaurant'],
                'subtotal'             => $validated['subtotal'],
                'delivery_fee'         => $validated['deliveryFee'],
                'discount'             => $validated['discount'],
                'total'                => $validated['total'],
                'payment_method'       => $validated['paymentMethod'],
                'delivery_address'     => $validated['deliveryAddress'],
                'contact_number'       => $validated['contactNumber'],
                'special_instructions' => $validated['specialInstructions'] ?? null,
                'delivery_type'        => $validated['deliveryType'],
                'scheduled_date'       => $validated['scheduledDate'] ?? null,
                'scheduled_time'       => $validated['scheduledTime'] ?? null,
                'status'               => 'Pending',
                'payment_status'       => $validated['paymentMethod'] === 'cod' ? 'paid' : 'awaiting_confirmation',
                'promotion_id'         => $promotionId,
            ]);

            foreach ($validated['items'] as $item) {
                // Update Stock and Validate Ownership
                $menuItem = MenuItem::find($item['id']);
                
                if (!$menuItem || $menuItem->restaurant_owner_id != $validated['restaurantId']) {
                    throw new \Exception("Item '{$item['name']}' does not belong to the selected restaurant.");
                }

                $orderItem = $order->items()->create([
                    'menu_item_id' => $item['id'],
                    'item_name'    => $item['name'],
                    'quantity'     => $item['quantity'],
                    'price'        => $item['price'],
                    'image'        => MediaPath::normalizeStoredPath($item['image'] ?? null),
                    'variations'   => isset($item['variations']) ? json_encode($item['variations']) : null,
                ]);

                $menuItem->decrement('stock_level', $item['quantity']);
                
                // Auto-toggle availability if stock reaches 0
                if ($menuItem->auto_toggle && $menuItem->stock_level <= 0) {
                    $menuItem->update(['available' => false, 'stock_level' => 0]);
                }
            }

            Log::info('Order placed successfully', [
                'order_id'            => $order->id,
                'customer_id'         => $userId,
                'restaurant_owner_id' => $order->restaurant_owner_id,
            ]);

            Cart::updateOrCreate(
                ['user_id' => $userId],
                ['items' => []]
            );

            return response()->json($order->load('items'), 201);
        });
    }

    /**
     * Update order status.
     * Owners can only update orders that belong to their restaurant (FK check).
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Order Confirmed,Out for Delivery,Delivered,Cancelled',
        ]);

        // Use lockForUpdate to prevent race conditions during status changes
        $order = Order::where('id', $id)->lockForUpdate()->firstOrFail();
        $user  = $request->user();

        // Owners: strict FK-based ownership check
        if ($user instanceof RestaurantOwner) {
            if ($order->restaurant_owner_id != $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } elseif ($user->role === 'customer') {
            // Customers can only cancel their own orders
            if ($order->customer_id != $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            if ($validated['status'] !== 'Cancelled') {
                return response()->json(['message' => 'Customers can only cancel orders'], 403);
            }
        } else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        DB::transaction(function () use ($order, $validated, $user) {
            $oldStatus = $order->status;
            $order->update(['status' => $validated['status']]);

            Log::info('Order status updated', [
                'order_id'   => $order->id,
                'old_status' => $oldStatus,
                'new_status' => $validated['status'],
                'updated_by' => $user->id,
                'user_type'  => get_class($user)
            ]);

            // Handle Stock Restoration on Cancellation
            if ($validated['status'] === 'Cancelled' && $oldStatus !== 'Cancelled') {
                foreach ($order->items as $item) {
                    if ($item->menu_item_id) {
                        $menuItem = MenuItem::where('id', $item->menu_item_id)->lockForUpdate()->first();
                        if ($menuItem) {
                            $menuItem->increment('stock_level', $item->quantity);
                            
                            // Restore availability if stock > 0
                            if ($menuItem->auto_toggle && $menuItem->stock_level > 0) {
                                $menuItem->update(['available' => true]);
                            }
                        }
                    }
                }
            }
        });

        return response()->json($order->fresh('items'));
    }

    /**
     * Customer uploads a payment receipt file that is stored on the public disk.
     */
    public function uploadReceipt(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $user = $request->user();

        if ($order->customer_id != $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'receipt' => 'required|file|image|max:10240', // Max 10MB
            'payment_sender_name' => 'required|string|max:255',
            'payment_transaction_id' => 'required|string|max:255',
        ]);

        if ($order->payment_method === 'cod') {
            return response()->json(['message' => 'Cash on delivery orders do not require a payment receipt.'], 422);
        }

        $existingReceiptPath = MediaPath::normalizeStoredPath($order->getRawOriginal('payment_receipt'));

        if (
            is_string($existingReceiptPath)
            && $existingReceiptPath !== ''
            && !str_starts_with($existingReceiptPath, 'data:')
            && !preg_match('/^https?:\/\//i', $existingReceiptPath)
        ) {
            PublicUpload::delete($existingReceiptPath);
        }

        $storedPath = PublicUpload::store($request->file('receipt'), "orders/receipts/{$order->id}");

        $order->update([
            'payment_receipt' => MediaPath::normalizeStoredPath($storedPath),
            'payment_sender_name' => $request->payment_sender_name,
            'payment_transaction_id' => $request->payment_transaction_id,
            'payment_status' => 'pending_verification',
        ]);

        return response()->json([
            'message' => 'Receipt uploaded successfully',
            'payment_status' => 'pending_verification',
            'payment_receipt' => $order->fresh()->payment_receipt,
        ]);
    }

    /**
     * Owner confirms or rejects payment for an order.
     */
    public function confirmPayment(Request $request, $id)
    {
        $validated = $request->validate([
            'action' => 'required|string|in:confirm,reject',
        ]);

        $order = Order::findOrFail($id);
        $owner = $request->user();

        if ($order->restaurant_owner_id != $owner->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $newStatus = $validated['action'] === 'confirm' ? 'paid' : 'rejected';
        $order->update(['payment_status' => $newStatus]);

        Log::info('Payment status updated', [
            'order_id' => $order->id,
            'action' => $validated['action'],
            'owner_id' => $owner->id,
        ]);

        return response()->json(['message' => 'Payment ' . $validated['action'] . 'ed', 'payment_status' => $newStatus]);
    }
}
