<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\RestaurantOwner;
use App\Models\Category;
use App\Models\MenuItem;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $allRestaurantMenus = [
            'Jollibee' => [
                'Chickenjoy Meals' => [
                    ['title' => 'Chickenjoy Solo', 'description' => '1-pc crispy fried chicken, regular fries & drinks.', 'price' => 3.50, 'image' => '/assets/images/service/jollibee/1pc-Chickenjoy-Solo.svg', 'stock_level' => 50],
                    ['title' => 'Chickenjoy 2-pc', 'description' => '2-pc fried chicken with rice and gravy.', 'price' => 5.80, 'image' => '/assets/images/service/jollibee/2pc-Chickenjoy-Solo.svg', 'stock_level' => 40],
                    ['title' => 'Chickenjoy Bucket 8-pc', 'description' => 'Family bucket of 8 crispy chicken pieces.', 'price' => 18.00, 'image' => '/assets/images/service/jollibee/Chickenjoy-Bucket-8pc.svg', 'stock_level' => 20],
                    ['title' => '10-pc Chicken Nuggets', 'description' => 'Juicy chicken nuggets with dipping sauce.', 'price' => 4.20, 'image' => '/assets/images/service/jollibee/10-pc-Chicken-Nuggets.svg', 'stock_level' => 30],
                ],
                'Burgers & Sandwiches' => [
                    ['title' => 'Yumburger', 'description' => "Classic beef burger with Jollibee's signature sauce.", 'price' => 1.80, 'image' => '/assets/images/service/jollibee/Yumburger.svg', 'stock_level' => 100],
                    ['title' => 'Cheesy Yumburger', 'description' => 'Yumburger topped with melted American cheese.', 'price' => 2.30, 'image' => '/assets/images/service/jollibee/Cheesy-Yumburger.svg', 'stock_level' => 80],
                    ['title' => 'Creamy Ranch Chicken Sandwich', 'description' => 'Crispy chicken fillet in a soft burger bun with ranch.', 'price' => 3.00, 'image' => '/assets/images/service/jollibee/Creamy-Ranch-Chicken-Sandwich.svg', 'stock_level' => 45],
                ],
                'Pasta & Rice' => [
                    ['title' => 'Jolly Spaghetti', 'description' => 'Sweet-style spaghetti with hotdog slices and cheese.', 'price' => 2.80, 'image' => '/assets/images/service/jollibee/Jolly-Spaghetti.svg', 'stock_level' => 60],
                    ['title' => 'Garlic Rice', 'description' => 'Fragrant garlic fried rice perfect with any meal.', 'price' => 1.50, 'image' => '/assets/images/service/jollibee/Garlic-Rice.svg', 'stock_level' => 150],
                    ['title' => 'Jolly Hotdog', 'description' => 'Grilled hotdog in a soft bun with cheese sauce.', 'price' => 2.00, 'image' => '/assets/images/service/jollibee/Jolly-Hotdog.svg', 'stock_level' => 40],
                ],
                'Desserts & Drinks' => [
                    ['title' => 'Peach Mango Pie', 'description' => 'Flaky pastry filled with sweet peach and mango.', 'price' => 1.20, 'image' => '/assets/images/service/jollibee/Peach-Mango-Pie.svg', 'stock_level' => 25],
                    ['title' => 'Jolly Sundae', 'description' => 'Creamy soft-serve in chocolate or strawberry.', 'price' => 1.00, 'image' => '/assets/images/service/jollibee/Jolly-Sundae.svg', 'stock_level' => 30],
                    ['title' => 'Coke Float', 'description' => 'Refreshing Coke with soft-serve vanilla.', 'price' => 1.50, 'image' => '/assets/images/service/jollibee/Coke-Float.svg', 'stock_level' => 50],
                ]
            ],
            'McDonald\'s' => [
                'Mix & Match' => [
                    ['title' => 'McSavers Burger', 'description' => 'Budget-friendly beef burger with lettuce and ketchup.', 'price' => 1.50, 'image' => '/assets/images/service/mcdonald/McSavers-Burger.svg', 'stock_level' => 80],
                    ['title' => 'McSavers McFries', 'description' => 'Small golden fries at a great everyday price.', 'price' => 1.20, 'image' => '/assets/images/service/mcdonald/McSavers-Fries.svg', 'stock_level' => 100],
                    ['title' => 'McSavers Sundae', 'description' => 'Soft-serve sundae in chocolate or strawberry drizzle.', 'price' => 1.00, 'image' => '/assets/images/service/mcdonald/McSavers-Sundae.svg', 'stock_level' => 45],
                    ['title' => 'McSavers Fried Chicken', 'description' => '1-pc crispy chicken at budget price.', 'price' => 2.00, 'image' => '/assets/images/service/mcdonald/McSavers-Chicken-Mcdo.svg', 'stock_level' => 60],
                ],
                'Fully Loaded' => [
                    ['title' => 'Big Mac', 'description' => 'Double beef patty, special sauce, lettuce, cheese, pickles.', 'price' => 5.00, 'image' => '/assets/images/service/mcdonald/Big-Mac.svg', 'stock_level' => 50],
                    ['title' => 'Quarter Pounder with Cheese', 'description' => 'Quarter-pound beef with fresh tomato and crispy lettuce.', 'price' => 5.50, 'image' => '/assets/images/service/mcdonald/Quarter-Pounder-with-Cheese.svg', 'stock_level' => 40],
                    ['title' => 'Crispy Chicken Ala King Solo', 'description' => 'Crispy chicken fillets with creamy ala king sauce.', 'price' => 4.80, 'image' => '/assets/images/service/mcdonald/Crispy-Chicken-Ala-King-Solo.svg', 'stock_level' => 35],
                    ['title' => 'BFF Fries', 'description' => 'Our largest serving of golden crispy fries.', 'price' => 3.50, 'image' => '/assets/images/service/mcdonald/BFF-Fries.svg', 'stock_level' => 70],
                ],
                'McCafé' => [
                    ['title' => 'McCafe Sea Salt Caramel Iced Coffee', 'description' => 'Iced coffee with sea salt caramel.', 'price' => 3.80, 'image' => '/assets/images/service/mcdonald/McCafe-Sea-Salt-Caramel-Iced-Coffee.svg', 'stock_level' => 30],
                    ['title' => 'McCafe Cereal Milk Iced Coffee', 'description' => 'Iced coffee swirled with cereal milk sweetness.', 'price' => 3.50, 'image' => '/assets/images/service/mcdonald/McCafe-Cereal-Milk-Iced-Coffee.svg', 'stock_level' => 30],
                    ['title' => 'McFlurry with Oreo', 'description' => 'Soft serve blended with crushed Oreo cookies.', 'price' => 3.00, 'image' => '/assets/images/service/mcdonald/McFlurry-with-Oreo.svg', 'stock_level' => 40],
                ],
                'Happy Meals' => [
                    ['title' => 'Chicken McDo Happy Meal', 'description' => '1-pc chicken, small fries, juice, and a toy surprise.', 'price' => 4.00, 'image' => '/assets/images/service/mcdonald/Chicken-Mcdo-Happy-Meal.svg', 'stock_level' => 20],
                    ['title' => 'Burger Happy Meal', 'description' => 'Cheeseburger, small fries, apple juice, and a toy.', 'price' => 3.80, 'image' => '/assets/images/service/mcdonald/Burger-Mcdo-Happy-Meal.svg', 'stock_level' => 20],
                ]
            ],
            'Sushi Nori' => [
                'Signature Rolls' => [
                    ['title' => 'California Roll', 'description' => 'Crab stick, mango, cucumber, and mayo.', 'price' => 8.00, 'image' => '/assets/images/service/sushiNori/California-Roll.svg', 'stock_level' => 40],
                    ['title' => 'Tuna Roll', 'description' => 'Fresh tuna chunks rolled in nori.', 'price' => 9.50, 'image' => '/assets/images/service/sushiNori/Tuna-Roll.svg', 'stock_level' => 30],
                    ['title' => 'Tamago Roll', 'description' => 'Sweet Japanese omelette in a sushi roll.', 'price' => 9.00, 'image' => '/assets/images/service/sushiNori/Tamago-Roll.svg', 'stock_level' => 30],
                    ['title' => 'Salmon Aburi', 'description' => 'Torched Norwegian salmon with yuzu ponzu and scallion.', 'price' => 10.50, 'image' => '/assets/images/service/sushiNori/Salmon-Aburi.svg', 'stock_level' => 25],
                ],
                'Hot Bowls' => [
                    ['title' => 'Gyudon Beef Bowl', 'description' => 'Seasoned beef and onions over steamed Japanese rice.', 'price' => 8.50, 'image' => '/assets/images/service/sushiNori/Gyudon-Beef-Bowl.svg', 'stock_level' => 35],
                    ['title' => 'Chirashi Bowl', 'description' => 'Assorted sashimi over sushi rice with pickled ginger.', 'price' => 12.00, 'image' => '/assets/images/service/sushiNori/Chirasi-Bowl.svg', 'stock_level' => 20],
                ],
                'Grills & Mains' => [
                    ['title' => 'Wagyu Teppan Donburi', 'description' => 'Premium wagyu beef grilled teppan style over rice.', 'price' => 15.00, 'image' => '/assets/images/service/sushiNori/Wagyu-Teppan-Donburi.svg', 'stock_level' => 15],
                    ['title' => 'Karaage Teriyaki', 'description' => 'Japanese fried chicken glazed with teriyaki sauce.', 'price' => 11.00, 'image' => '/assets/images/service/sushiNori/Karaage-Teriyaki.svg', 'stock_level' => 30],
                ],
                'Beverages' => [
                    ['title' => 'Matcha Ube Latte', 'description' => 'Ceremonial grade matcha with sweet ube oat milk.', 'price' => 4.00, 'image' => '/assets/images/service/sushiNori/Matcha-Ube-Latte.svg', 'stock_level' => 25],
                    ['title' => 'Matcha Yuzu Lemonade', 'description' => 'Refreshing yuzu citrus matcha with sparkling water.', 'price' => 3.50, 'image' => '/assets/images/service/sushiNori/Matcha-Yuzu-Lemonade.svg', 'stock_level' => 25],
                    ['title' => 'Matcha Strawberry Latte', 'description' => 'Brewed matcha tea with fresh strawberry pure and milk.', 'price' => 3.00, 'image' => '/assets/images/service/sushiNori/Matcha-Strawberry-Latte.svg', 'stock_level' => 25],
                ]
            ],
            'Mang Inasal' => [
                'Paborito Meals' => [
                    ['title' => 'Chicken Paa Solo', 'description' => 'Charcoal-grilled chicken leg with unli-rice and soup.', 'price' => 3.80, 'image' => '/assets/images/service/mangInasal/Chicken-Paa-Solo.svg', 'stock_level' => 60],
                    ['title' => 'Chicken Pecho Solo', 'description' => 'Grilled chicken breast, extra juicy with calamansi marinade.', 'price' => 4.00, 'image' => '/assets/images/service/mangInasal/Chicken-Pecho-Solo.svg', 'stock_level' => 50],
                    ['title' => 'BBQ Pork Combo', 'description' => 'Skewered pork BBQ with garlic rice and sawsawan.', 'price' => 4.50, 'image' => '/assets/images/service/mangInasal/BBQ-Pork-Combo.svg', 'stock_level' => 45],
                    ['title' => 'Liempo Meal', 'description' => 'Grilled pork belly with rice. A Cebuano classic.', 'price' => 5.00, 'image' => '/assets/images/service/mangInasal/Liempo-Meal.svg', 'stock_level' => 40],
                ],
                'Fiesta Packages' => [
                    ['title' => '4-pc Inasal Pack', 'description' => '4 pcs chicken inasal, rice, soup, sawsawan for 2-3 pax.', 'price' => 12.00, 'image' => '/assets/images/service/mangInasal/4-Pc-Inasal-Pack.svg', 'stock_level' => 20],
                    ['title' => 'Family Fiesta Bucket', 'description' => 'Perfect chicken family fiesta meal.', 'price' => 22.00, 'image' => '/assets/images/service/mangInasal/All-Chicken-Inasal-Family-Fiesta.svg', 'stock_level' => 15],
                ],
                'Desserts & Drinks' => [
                    ['title' => 'Halo-Halo', 'description' => 'Shaved ice with leche flan and ube ice cream.', 'price' => 2.50, 'image' => '/assets/images/service/mangInasal/Halo-Halo.svg', 'stock_level' => 50],
                    ['title' => 'Crema de Leche Halo-Halo', 'description' => 'Sweet creamy shaved ice with milk drizzle.', 'price' => 2.00, 'image' => '/assets/images/service/mangInasal/Crema-de-Leche-Halo-Halo.svg', 'stock_level' => 50],
                ]
            ],
            'KFC' => [
                'Chicken Meals' => [
                    ['title' => '1-PC Fully Loaded Meal', 'description' => '1-pc chicken, rice, mushroom soup, and drink.', 'price' => 4.00, 'image' => '/assets/images/service/kfc/1-PC-Fully-Loaded-Meal.svg', 'stock_level' => 45],
                    ['title' => '1-pc Chicken Meal', 'description' => '1-pc original recipe chicken, rice, and gravy.', 'price' => 3.20, 'image' => '/assets/images/service/kfc/1pc-Chicken-Meal.svg', 'stock_level' => 50],
                    ['title' => '2-pc Chicken Meal', 'description' => '2-pc original recipe chicken, rice, and gravy.', 'price' => 5.50, 'image' => '/assets/images/service/kfc/2pc-Chicken-Meal.svg', 'stock_level' => 40],
                    ['title' => '8-pc Chicken Bucket', 'description' => '8 pieces of delicious fried chicken.', 'price' => 18.00, 'image' => '/assets/images/service/kfc/8pc-Chicken-Bucket.svg', 'stock_level' => 20],
                ],
                'Bowls' => [
                    ['title' => 'Ala King Rice Bowl', 'description' => 'Chicken shots with Ala King sauce and rice.', 'price' => 2.80, 'image' => '/assets/images/service/kfc/Ala-King-Rice-Bowl.svg', 'stock_level' => 50],
                    ['title' => 'Famous Bowl', 'description' => 'Mashed potatoes topped with chicken, corn, gravy and cheese.', 'price' => 3.50, 'image' => '/assets/images/service/kfc/Famous-Bowl.svg', 'stock_level' => 40],
                ],
                'Burgers & Wraps' => [
                    ['title' => 'Zinger Burger', 'description' => 'Spicy chicken fillet burger with lettuce and mayo.', 'price' => 3.50, 'image' => '/assets/images/service/kfc/Zinger-Burger.svg', 'stock_level' => 50],
                    ['title' => 'Cali Maki Twister', 'description' => 'Chicken strips, cucumber, mango, wrapped in a tortilla.', 'price' => 3.20, 'image' => '/assets/images/service/kfc/Cali-Maki-Twister.svg', 'stock_level' => 35],
                ]
            ],
            'Chowking' => [
                'Chao Fan' => [
                    ['title' => 'Beef Chao Fan', 'description' => 'Fried rice served with beef toppings.', 'price' => 2.50, 'image' => '/assets/images/service/chowking/Beef-Chao-Fan.svg', 'stock_level' => 70],
                    ['title' => 'Pork Chao Fan', 'description' => 'Fried rice served with pork toppings.', 'price' => 2.30, 'image' => '/assets/images/service/chowking/Pork-Chao-Fan.svg', 'stock_level' => 70],
                    ['title' => 'Siomai Chao Fan', 'description' => 'Fried rice topped with steamed siomai.', 'price' => 3.00, 'image' => '/assets/images/service/chowking/Siomai-Chao-Fan.svg', 'stock_level' => 60],
                ],
                'Noodles' => [
                    ['title' => 'Beef Mami', 'description' => 'Noodle soup with slow-cooked beef bricket.', 'price' => 3.50, 'image' => '/assets/images/service/chowking/Beef-Mami.svg', 'stock_level' => 40],
                    ['title' => 'Pancit Canton', 'description' => 'Stir-fried noodles with meat and vegetables.', 'price' => 3.50, 'image' => '/assets/images/service/chowking/Pancit-Canton.svg', 'stock_level' => 40],
                ],
                'Chicken & Dimsum' => [
                    ['title' => 'Chinese-Style Fried Chicken Lauriat', 'description' => 'Chicken, rice, noodles, chicharap, and buchi.', 'price' => 6.00, 'image' => '/assets/images/service/chowking/Chinese-Style-Fried-Chicken-Lauriat.svg', 'stock_level' => 30],
                    ['title' => 'Lumpiang Shanghai Rice Meal', 'description' => 'Fried spring rolls with rice.', 'price' => 2.50, 'image' => '/assets/images/service/chowking/Lumpiang-Shanghai-Rice-Meal.svg', 'stock_level' => 50],
                ],
                'Desserts & Drinks' => [
                    ['title' => 'Halo-Halo Supreme', 'description' => 'Classic Filipino shaved ice dessert.', 'price' => 3.50, 'image' => '/assets/images/service/chowking/Halo-Halo-Supreme.svg', 'stock_level' => 40],
                ]
            ],
        ];

        foreach ($allRestaurantMenus as $restName => $categories) {
            $restaurant = RestaurantOwner::where('restaurant_name', $restName)->first();

            if (!$restaurant)
                continue;

            foreach ($categories as $catName => $items) {
                $category = Category::updateOrCreate(
                ['restaurant_owner_id' => $restaurant->id, 'name' => $catName]
                );

                foreach ($items as $itemData) {
                    MenuItem::updateOrCreate(
                    ['restaurant_owner_id' => $restaurant->id, 'title' => $itemData['title']],
                        array_merge($itemData, [
                        'category_id' => $category->id,
                        'unit' => 'units',
                        'min_threshold' => 10,
                        'auto_toggle' => true,
                        'available' => $itemData['stock_level'] > 0
                    ])
                    );
                }
            }
        }
    }
}
