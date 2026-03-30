<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Support\MediaPath;
use Illuminate\Http\Request;

use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function getCategories()
    {
        $owner = Auth::user();
        $categories = Category::where('restaurant_owner_id', $owner->id)
            ->orderBy('display_order')
            ->orderBy('id')
            ->get();
        return response()->json($categories);
    }

    public function storeCategory(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);
        $owner = Auth::user();
        $nextDisplayOrder = (Category::where('restaurant_owner_id', $owner->id)->max('display_order') ?? -1) + 1;

        $category = Category::create([
            'restaurant_owner_id' => $owner->id,
            'name' => $request->name,
            'display_order' => $nextDisplayOrder,
        ]);

        return response()->json($category, 201);
    }

    public function updateCategory(Request $request, $id)
    {
        $request->validate(['name' => 'required|string|max:255']);
        $owner = Auth::user();
        $category = Category::where('restaurant_owner_id', $owner->id)->findOrFail($id);

        $category->update([
            'name' => $request->name,
        ]);

        return response()->json($category);
    }

    public function reorderCategories(Request $request)
    {
        $request->validate([
            'category_ids' => 'required|array|min:1',
            'category_ids.*' => 'integer|distinct',
        ]);

        $owner = Auth::user();
        $ownerCategoryIds = Category::where('restaurant_owner_id', $owner->id)
            ->orderBy('display_order')
            ->orderBy('id')
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->values()
            ->all();

        $submittedIds = collect($request->category_ids)
            ->map(fn ($id) => (int) $id)
            ->values()
            ->all();

        $sortedOwnerIds = $ownerCategoryIds;
        $sortedSubmittedIds = $submittedIds;
        sort($sortedOwnerIds);
        sort($sortedSubmittedIds);

        if ($sortedOwnerIds !== $sortedSubmittedIds) {
            return response()->json([
                'message' => 'The submitted category order must include all of your categories exactly once.',
            ], 422);
        }

        DB::transaction(function () use ($submittedIds, $owner) {
            foreach ($submittedIds as $index => $categoryId) {
                Category::where('restaurant_owner_id', $owner->id)
                    ->where('id', $categoryId)
                    ->update(['display_order' => $index]);
            }
        });

        return response()->json([
            'message' => 'Category order updated successfully.',
        ]);
    }

    public function destroyCategory($id)
    {
        $owner = Auth::user();
        $category = Category::where('restaurant_owner_id', $owner->id)->findOrFail($id);
        $category->delete();
        $this->resequenceCategories($owner->id);
        return response()->json(['message' => 'Category deleted']);
    }


    public function getMenuItems()
    {
        $owner = Auth::user();
        $items = MenuItem::where('restaurant_owner_id', $owner->id)->with('category')->get();
        return response()->json($items);
    }

    public function storeMenuItem(Request $request)
    {
        $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'image' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
            'stock_level' => 'integer|min:0',
            'min_threshold' => 'integer|min:0',
            'unit' => 'string|max:50',
            'auto_toggle' => 'boolean',
        ]);

        $owner = Auth::user();
        $imagePath = MediaPath::normalizeStoredPath($request->image);

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('menu_items', 'public');
            $imagePath = MediaPath::normalizeStoredPath($path);
        }

        $item = MenuItem::create([
            'restaurant_owner_id' => $owner->id,
            'category_id' => $request->category_id,
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'image' => $imagePath,
            'available' => $request->auto_toggle ? $request->stock_level > 0 : true,
            'stock_level' => $request->stock_level,
            'min_threshold' => $request->min_threshold,
            'unit' => $request->unit,
            'auto_toggle' => $request->auto_toggle,
        ]);

        return response()->json($item, 201);
    }

    public function updateMenuItem(Request $request, $id)
    {
        $owner = Auth::user();
        $item = MenuItem::where('restaurant_owner_id', $owner->id)->findOrFail($id);

        $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'image' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
            'available' => 'boolean',
            'stock_level' => 'integer|min:0',
            'min_threshold' => 'integer|min:0',
            'unit' => 'string|max:50',
            'auto_toggle' => 'boolean',
        ]);

        $data = $request->except(['image_file']);

        if (array_key_exists('image', $data)) {
            $data['image'] = MediaPath::normalizeStoredPath($data['image']);
        }
        
        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('menu_items', 'public');
            $data['image'] = MediaPath::normalizeStoredPath($path);
        }

        if ($request->has('stock_level') && $request->auto_toggle) {
            $data['available'] = $request->stock_level > 0;
        }

        $item->update($data);

        return response()->json($item);
    }

    public function updateStock(Request $request, $id)
    {
        $owner = Auth::user();
        $item = MenuItem::where('restaurant_owner_id', $owner->id)->findOrFail($id);

        $request->validate([
            'stock_level' => 'required|integer|min:0',
        ]);

        $updateData = ['stock_level' => $request->stock_level];
        if ($item->auto_toggle) {
            $updateData['available'] = $request->stock_level > 0;
        }

        $item->update($updateData);

        return response()->json($item);
    }

    public function toggleAvailability(Request $request, $id)
    {
        $owner = Auth::user();
        $item = MenuItem::where('restaurant_owner_id', $owner->id)->findOrFail($id);

        $request->validate([
            'available' => 'required|boolean',
        ]);

        $item->update(['available' => $request->available]);

        return response()->json($item);
    }

    public function destroyMenuItem($id)
    {
        $owner = Auth::user();
        $item = MenuItem::where('restaurant_owner_id', $owner->id)->findOrFail($id);
        $item->delete();
        return response()->json(['message' => 'Menu item deleted successfully.']);
    }

    private function resequenceCategories(int $ownerId): void
    {
        $categories = Category::where('restaurant_owner_id', $ownerId)
            ->orderBy('display_order')
            ->orderBy('id')
            ->get(['id']);

        foreach ($categories as $index => $category) {
            $category->update(['display_order' => $index]);
        }
    }
}
