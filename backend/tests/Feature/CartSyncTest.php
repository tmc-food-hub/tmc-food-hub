<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\MenuItem;
use App\Models\RestaurantOwner;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CartSyncTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_sync_and_fetch_their_cart(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $owner = $this->createOwner();
        $menuItem = $this->createMenuItem($owner);

        Sanctum::actingAs($customer);

        $payload = [
            'items' => [[
                'cartItemId' => '1_default_none',
                'id' => $menuItem->id,
                'title' => $menuItem->title,
                'image' => null,
                'price' => 125,
                'originalPrice' => 125,
                'storeName' => $owner->restaurant_name,
                'restaurantId' => $owner->id,
                'variation' => null,
                'addOns' => [],
                'quantity' => 2,
            ]],
        ];

        $this->putJson('/api/cart', $payload)
            ->assertOk()
            ->assertJsonPath('items.0.id', $menuItem->id)
            ->assertJsonPath('items.0.quantity', 2);

        $this->getJson('/api/cart')
            ->assertOk()
            ->assertJsonPath('items.0.id', $menuItem->id)
            ->assertJsonPath('items.0.restaurantId', $owner->id);
    }

    public function test_customer_cart_is_isolated_per_user(): void
    {
        $firstCustomer = User::factory()->create(['role' => 'customer']);
        $secondCustomer = User::factory()->create(['role' => 'customer']);
        $owner = $this->createOwner();
        $menuItem = $this->createMenuItem($owner);

        Sanctum::actingAs($firstCustomer);
        $this->putJson('/api/cart', [
            'items' => [[
                'id' => $menuItem->id,
                'title' => $menuItem->title,
                'image' => null,
                'price' => 125,
                'storeName' => $owner->restaurant_name,
                'restaurantId' => $owner->id,
                'variation' => null,
                'addOns' => [],
                'quantity' => 1,
            ]],
        ])->assertOk();

        Sanctum::actingAs($secondCustomer);
        $this->getJson('/api/cart')
            ->assertOk()
            ->assertJson(['items' => []]);
    }

    public function test_placing_order_clears_customer_cart(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        $owner = $this->createOwner();
        $menuItem = $this->createMenuItem($owner, 10);

        Cart::create([
            'user_id' => $customer->id,
            'items' => [[
                'id' => $menuItem->id,
                'title' => $menuItem->title,
                'image' => null,
                'price' => 125,
                'storeName' => $owner->restaurant_name,
                'restaurantId' => $owner->id,
                'variation' => null,
                'addOns' => [],
                'quantity' => 1,
            ]],
        ]);

        Sanctum::actingAs($customer);

        $this->postJson('/api/orders', [
            'restaurant' => $owner->restaurant_name,
            'restaurantId' => $owner->id,
            'subtotal' => 125,
            'deliveryFee' => 3,
            'discount' => 0,
            'total' => 128,
            'paymentMethod' => 'cod',
            'deliveryAddress' => '123 Test Street',
            'contactNumber' => '09171234567',
            'specialInstructions' => 'Leave at the gate',
            'deliveryType' => 'asap',
            'items' => [[
                'id' => $menuItem->id,
                'name' => $menuItem->title,
                'quantity' => 1,
                'price' => 125,
                'image' => null,
                'variations' => null,
            ]],
        ])->assertCreated();

        $this->assertSame([], $customer->cart()->first()->fresh()->items);
    }

    private function createOwner(): RestaurantOwner
    {
        return RestaurantOwner::create([
            'name' => 'Owner Name',
            'first_name' => 'Owner',
            'last_name' => 'Name',
            'email' => fake()->unique()->safeEmail(),
            'password' => bcrypt('password'),
            'restaurant_name' => 'Sync Test Restaurant',
            'business_address' => '123 Test Street',
            'business_contact_number' => '09171234567',
            'business_permit' => 'PERMIT-123',
            'operating_status' => 'open',
        ]);
    }

    private function createMenuItem(RestaurantOwner $owner, int $stockLevel = 20): MenuItem
    {
        return MenuItem::create([
            'restaurant_owner_id' => $owner->id,
            'title' => 'Sync Burger',
            'description' => 'Test item',
            'price' => 125,
            'available' => true,
            'stock_level' => $stockLevel,
            'min_threshold' => 2,
            'unit' => 'pcs',
            'auto_toggle' => true,
        ]);
    }
}
