<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RestaurantOwner;
use Illuminate\Support\Facades\Hash;

class OwnerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owners = [
            [
                'name' => 'Jollibee Owner',
                'first_name' => 'Jollibee',
                'last_name' => 'Owner',
                'email' => 'jollibee@tmcfoodhub.com',
                'password' => 'jollibee123',
                'restaurant_name' => 'Jollibee',
                'business_address' => 'SM City, North Reclamation Area, Cebu City',
                'business_contact_number' => '+63 32 234 5678',
                'business_permit' => 'BP-2024-0001',
                'logo' => '/assets/images/service/resturant_logo/jollibee.svg',
                'cover_image' => '/assets/images/service/jollibee/2pc-Chickenjoy-Solo.svg',
            ],
            [
                'name' => 'McDonald\'s Owner',
                'first_name' => 'McDonald\'s',
                'last_name' => 'Owner',
                'email' => 'mcdo@tmcfoodhub.com',
                'password' => 'mcdo123',
                'restaurant_name' => 'McDonald\'s',
                'business_address' => 'Ayala Center Cebu, Archbishop Reyes Ave.',
                'business_contact_number' => '+63 32 888 1234',
                'business_permit' => 'BP-2024-0002',
                'logo' => '/assets/images/service/resturant_logo/mcdonald-s-7.svg',
                'cover_image' => '/assets/images/service/mcdonald/Big-Mac.svg',
            ],
            [
                'name' => 'Sushi Nori Owner',
                'first_name' => 'Sushi',
                'last_name' => 'Nori',
                'email' => 'sushinori@tmcfoodhub.com',
                'password' => 'sushi123',
                'restaurant_name' => 'Sushi Nori',
                'business_address' => 'Cebu IT Park, Lahug, Cebu City',
                'business_contact_number' => '+63 32 411 9900',
                'business_permit' => 'BP-2024-0003',
                'logo' => '/assets/images/service/resturant_logo/sushi-nori.svg',
                'cover_image' => '/assets/images/service/sushiNori/California-Roll.svg',
            ],
            [
                'name' => 'Mang Inasal Owner',
                'first_name' => 'Mang',
                'last_name' => 'Inasal',
                'email' => 'manginasal@tmcfoodhub.com',
                'password' => 'inasal123',
                'restaurant_name' => 'Mang Inasal',
                'business_address' => 'Colon Street, Downtown, Cebu City',
                'business_contact_number' => '+63 32 256 7788',
                'business_permit' => 'BP-2024-0004',
                'logo' => '/assets/images/service/resturant_logo/Mang_Inasal.svg',
                'cover_image' => '/assets/images/service/mangInasal/Chicken-Paa-Solo.svg',
            ],
            [
                'name' => 'KFC Owner',
                'first_name' => 'KFC',
                'last_name' => 'Owner',
                'email' => 'kfc@tmcfoodhub.com',
                'password' => 'kfc123',
                'restaurant_name' => 'KFC',
                'business_address' => 'Cebu IT Park, Lahug, Cebu City',
                'business_contact_number' => '+63 32 412 1234',
                'business_permit' => 'BP-2024-0005',
                'logo' => '/assets/images/service/resturant_logo/KFC.svg',
                'cover_image' => '/assets/images/service/kfc/1-PC-Fully-Loaded-Meal.svg',
            ],
            [
                'name' => 'Chowking Owner',
                'first_name' => 'Chowking',
                'last_name' => 'Owner',
                'email' => 'chowking@tmcfoodhub.com',
                'password' => 'chowking123',
                'restaurant_name' => 'Chowking',
                'business_address' => 'SM City Cebu',
                'business_contact_number' => '+63 32 234 9999',
                'business_permit' => 'BP-2024-0006',
                'logo' => '/assets/images/service/resturant_logo/chowking.svg',
                'cover_image' => '/assets/images/service/chowking/Chinese-Style-Fried-Chicken-Lauriat.svg',
            ],
        ];

        foreach ($owners as $ownerData) {
            RestaurantOwner::updateOrCreate(
            ['email' => $ownerData['email']],
            [
                'name' => $ownerData['name'],
                'first_name' => $ownerData['first_name'],
                'last_name' => $ownerData['last_name'],
                'password' => $ownerData['password'],
                'restaurant_name' => $ownerData['restaurant_name'],
                'business_address' => $ownerData['business_address'],
                'business_contact_number' => $ownerData['business_contact_number'],
                'business_permit' => $ownerData['business_permit'],
                'logo' => $ownerData['logo'] ?? null,
                'cover_image' => $ownerData['cover_image'] ?? null,
                'email_verified_at' => now(),
            ]
            );
        }
    }
}
