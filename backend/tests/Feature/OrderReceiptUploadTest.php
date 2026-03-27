<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\RestaurantOwner;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderReceiptUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_receipt_upload_is_stored_as_public_media_path(): void
    {
        Storage::fake('public');

        $customer = User::factory()->create([
            'role' => 'customer',
            'first_name' => 'Test',
            'last_name' => 'Customer',
        ]);

        $owner = RestaurantOwner::create([
            'name' => 'Owner Name',
            'first_name' => 'Owner',
            'last_name' => 'Name',
            'email' => 'owner@example.com',
            'password' => bcrypt('password'),
            'restaurant_name' => 'Test Restaurant',
            'business_address' => '123 Test Street',
            'business_contact_number' => '09171234567',
            'business_permit' => 'PERMIT-123',
        ]);

        $order = Order::create([
            'customer_id' => $customer->id,
            'restaurant_owner_id' => $owner->id,
            'store_name' => 'Test Restaurant',
            'subtotal' => 100,
            'delivery_fee' => 10,
            'discount' => 0,
            'total' => 110,
            'payment_method' => 'gcash',
            'delivery_address' => '123 Test Street',
            'contact_number' => '09171234567',
            'status' => 'Pending',
            'payment_status' => 'awaiting_confirmation',
            'delivery_type' => 'asap',
        ]);

        Sanctum::actingAs($customer);

        $response = $this->post("/api/orders/{$order->id}/upload-receipt", [
            'receipt' => UploadedFile::fake()->create('receipt.jpg', 256, 'image/jpeg'),
            'payment_sender_name' => 'Test Sender',
            'payment_transaction_id' => 'TXN-123456',
        ], [
            'Accept' => 'application/json',
        ]);

        $response->assertOk()
            ->assertJsonPath('payment_status', 'pending_verification');

        $order->refresh();

        $storedPath = $order->getRawOriginal('payment_receipt');

        $this->assertIsString($storedPath);
        $this->assertStringStartsWith("orders/receipts/{$order->id}/", $storedPath);
        $this->assertFalse(str_starts_with($storedPath, 'data:'));
        Storage::disk('public')->assertExists($storedPath);

        $this->assertSame('Test Sender', $order->payment_sender_name);
        $this->assertSame('TXN-123456', $order->payment_transaction_id);
        $this->assertSame('pending_verification', $order->payment_status);
        $this->assertStringContainsString('/api/media/orders/receipts/', $response->json('payment_receipt'));
    }
}
