<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\RestaurantOwner;

class RefreshTokenTest extends TestCase
{
    use DatabaseTransactions;

    public function test_customer_can_refresh_token()
    {
        $customer = User::factory()->create([
            'role' => 'customer',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'customer@example.com',
            'phone' => '1234567890',
            'address' => '123 Test St',
        ]);

        $token = $customer->createToken('auth-token')->plainTextToken;

        $response = $this->postJson('/api/refresh-token', [], [
            'Authorization' => "Bearer {$token}"
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'user' => ['id', 'email', 'role'],
                     'token'
                 ]);

        $this->assertNotEquals($token, $response->json('token'));
        $this->assertCount(1, $customer->tokens);
    }

    public function test_owner_can_refresh_token()
    {
        $owner = RestaurantOwner::create([
            'name' => 'Jane Owner',
            'first_name' => 'Jane',
            'last_name' => 'Owner',
            'email' => 'owner@example.com',
            'password' => bcrypt('password'),
            'restaurant_name' => 'Jane Restaurant',
            'business_address' => '456 Owner Rd',
            'business_contact_number' => '0987654321',
            'business_permit' => 'PERMIT123',
        ]);

        $token = $owner->createToken('owner-auth-token')->plainTextToken;

        $response = $this->postJson('/api/owner/refresh-token', [], [
            'Authorization' => "Bearer {$token}"
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'user' => ['id', 'email'],
                     'token'
                 ]);

        $this->assertNotEquals($token, $response->json('token'));
        $this->assertCount(1, $owner->tokens);
    }

    public function test_admin_can_refresh_token()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@example.com',
            'phone' => '1111111111',
            'address' => 'Admin HQ',
        ]);

        $token = $admin->createToken('admin-auth-token')->plainTextToken;

        $response = $this->postJson('/api/admin/refresh-token', [], [
            'Authorization' => "Bearer {$token}"
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'user' => ['id', 'email', 'role'],
                     'token'
                 ]);

        $this->assertEquals('admin', $response->json('user.role'));
        $this->assertNotEquals($token, $response->json('token'));
        $this->assertCount(1, $admin->tokens);
    }
}
