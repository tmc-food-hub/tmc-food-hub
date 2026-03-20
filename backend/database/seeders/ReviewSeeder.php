<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\RestaurantOwner;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $entries = [
            [
                'restaurant' => 'Jollibee',
                'customer' => ['first_name' => 'Maria', 'last_name' => 'L.', 'email' => 'reviews.maria@tmcfoodhub.com'],
                'rating' => 5,
                'review' => 'The Lumpiang Shanghai is so crispy and still hot when it arrived. Highly recommended for family dinners.',
                'helpful_count' => 8,
                'owner_reply' => 'Thank you, Maria. We appreciate the kind words and will keep the quality consistent.',
            ],
            [
                'restaurant' => 'Jollibee',
                'customer' => ['first_name' => 'James', 'last_name' => 'T.', 'email' => 'reviews.james@tmcfoodhub.com'],
                'rating' => 4,
                'review' => 'Great food as always. Delivery was a bit slow today because of the rain, but the rider kept everything dry.',
                'helpful_count' => 12,
            ],
            [
                'restaurant' => 'McDonald\'s',
                'customer' => ['first_name' => 'Lea', 'last_name' => 'S.', 'email' => 'reviews.lea@tmcfoodhub.com'],
                'rating' => 4,
                'review' => 'The burgers arrived neatly packed and the fries were still warm. Would order again during lunch breaks.',
                'helpful_count' => 5,
            ],
            [
                'restaurant' => 'Sushi Nori',
                'customer' => ['first_name' => 'Ken', 'last_name' => 'M.', 'email' => 'reviews.ken@tmcfoodhub.com'],
                'rating' => 5,
                'review' => 'Fresh ingredients and very presentable packaging. The California Roll tasted premium.',
                'helpful_count' => 10,
                'owner_reply' => 'We are happy you enjoyed it. Thank you for supporting Sushi Nori.',
            ],
            [
                'restaurant' => 'Mang Inasal',
                'customer' => ['first_name' => 'Grace', 'last_name' => 'C.', 'email' => 'reviews.grace@tmcfoodhub.com'],
                'rating' => 5,
                'review' => 'Chicken Paa was juicy and smoky, and the rice portions were generous. Very sulit.',
                'helpful_count' => 7,
            ],
            [
                'restaurant' => 'KFC',
                'customer' => ['first_name' => 'John', 'last_name' => 'D.', 'email' => 'reviews.john@tmcfoodhub.com'],
                'rating' => 5,
                'review' => 'The Zinger still hits every time. Portion size and flavor were both excellent.',
                'helpful_count' => 9,
            ],
            [
                'restaurant' => 'Chowking',
                'customer' => ['first_name' => 'Nena', 'last_name' => 'P.', 'email' => 'reviews.nena@tmcfoodhub.com'],
                'rating' => 4,
                'review' => 'Chao Fan and siomai are always my comfort order. Arrived on time and well packed.',
                'helpful_count' => 4,
            ],
        ];

        foreach ($entries as $index => $entry) {
            $owner = RestaurantOwner::where('restaurant_name', $entry['restaurant'])->first();
            if (!$owner) {
                continue;
            }

            $customer = User::updateOrCreate(
                ['email' => $entry['customer']['email']],
                [
                    'name' => $entry['customer']['first_name'] . ' ' . $entry['customer']['last_name'],
                    'first_name' => $entry['customer']['first_name'],
                    'last_name' => $entry['customer']['last_name'],
                    'password' => 'password',
                    'role' => 'customer',
                    'email_verified_at' => now(),
                ]
            );

            $menuItem = $owner->menuItems()->first();
            if (!$menuItem) {
                continue;
            }

            $order = Order::firstOrCreate(
                [
                    'customer_id' => $customer->id,
                    'restaurant_owner_id' => $owner->id,
                    'store_name' => $owner->restaurant_name,
                    'delivery_address' => $customer->address ?? ($owner->business_address . ' - Sample Customer Address'),
                    'contact_number' => $customer->phone ?? '09170000000',
                    'status' => 'Delivered',
                    'special_instructions' => 'Seeded review order ' . $index,
                ],
                [
                    'subtotal' => $menuItem->price * 2,
                    'delivery_fee' => 49,
                    'discount' => 0,
                    'total' => ($menuItem->price * 2) + 49,
                    'payment_method' => 'Cash on Delivery',
                    'delivery_type' => 'asap',
                    'scheduled_date' => null,
                    'scheduled_time' => null,
                ]
            );

            if ($order->items()->count() === 0) {
                $order->items()->create([
                    'menu_item_id' => $menuItem->id,
                    'item_name' => $menuItem->title,
                    'quantity' => 2,
                    'price' => $menuItem->price,
                    'image' => $menuItem->image,
                ]);
            }

            Review::updateOrCreate(
                ['order_id' => $order->id],
                [
                    'restaurant_owner_id' => $owner->id,
                    'customer_id' => $customer->id,
                    'rating' => $entry['rating'],
                    'review' => $entry['review'],
                    'photos' => $index % 2 === 0 ? array_values(array_filter([$menuItem->image])) : [],
                    'is_verified' => true,
                    'helpful_count' => $entry['helpful_count'],
                    'owner_reply' => $entry['owner_reply'] ?? null,
                    'owner_replied_at' => isset($entry['owner_reply']) ? now()->subHours(2) : null,
                ]
            );
        }
    }
}
