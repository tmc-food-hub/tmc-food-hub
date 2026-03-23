<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\RestaurantOwner;
use App\Models\MenuItem;
use App\Models\Review;

class MenuController extends Controller
{
    /**
     * List all restaurants for the customer-facing browse screen.
     * Returns restaurant info + total available item count.
     */
    public function index()
    {
        $restaurants = RestaurantOwner::withCount(['menuItems' => function ($q) {
            $q->where('available', true);
        }])
        ->get()
        ->map(function ($r) {
            $averageRating = Review::where('restaurant_owner_id', $r->id)->avg('rating');
            $reviewsCount = Review::where('restaurant_owner_id', $r->id)->count();

            return [
                'id'                      => $r->id,
                'name'                    => $r->restaurant_name,
                'restaurant_name'         => $r->restaurant_name,
                'owner_name'              => $r->name,
                'business_address'        => $r->business_address,
                'business_contact_number' => $r->business_contact_number,
                'available_items_count'   => $r->menu_items_count,
                'logo'                    => $r->logo,
                'cover_image'             => $r->cover_image,
                'rating'                  => $averageRating ? round($averageRating, 1) : 0,
                'reviews_count'           => $reviewsCount,
                'operating_status'        => $r->operating_status,
            ];
        });

        return response()->json($restaurants);
    }

    /**
     * Get a single restaurant's full menu grouped by category.
     * Called when customer opens a restaurant's menu page.
     */
    public function show($restaurantId)
    {
        $restaurant = RestaurantOwner::findOrFail($restaurantId);

        $menuByCategories = MenuItem::where('restaurant_owner_id', $restaurantId)
            ->where('available', true)
            ->with('category')
            ->get()
            ->groupBy(function ($item) {
                return $item->category ? $item->category->name : 'Uncategorized';
            });

        return response()->json([
            'restaurant' => [
                'id'                      => $restaurant->id,
                'name'                    => $restaurant->restaurant_name,
                'restaurant_name'         => $restaurant->restaurant_name,
                'owner_name'              => $restaurant->name,
                'business_address'        => $restaurant->business_address,
                'business_contact_number' => $restaurant->business_contact_number,
                'logo'                    => $restaurant->logo,
                'cover_image'             => $restaurant->cover_image,
                'rating'                  => round((float) Review::where('restaurant_owner_id', $restaurant->id)->avg('rating'), 1),
                'reviews_count'           => Review::where('restaurant_owner_id', $restaurant->id)->count(),
                'operating_status'        => $restaurant->operating_status,
            ],
            'menu' => $menuByCategories
        ]);
    }
}
