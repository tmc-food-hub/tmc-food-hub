<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Promotion;
use Illuminate\Support\Carbon;

class OwnerPromotionController extends Controller
{
    public function index(Request $request)
    {
        $owner = $request->user();
        
        // Fetch promotions where applicable_restaurants contains the owner's ID
        $promotions = Promotion::whereJsonContains('applicable_restaurants', clone $owner->id)
            ->orWhereJsonContains('applicable_restaurants', strval($owner->id))
            ->get();
            
        // Map over them to format nicely
        return response()->json($promotions->map(function ($promo) {
            return [
                'id' => $promo->id,
                'name' => $promo->name,
                'code' => $promo->code,
                'appliesTo' => $promo->applicability_type === 'all_items' ? 'All Items' : 'Specific Items',
                'type' => $promo->discount_type === 'percentage' ? 'Percentage Off (%)' : ($promo->discount_type === 'fixed' ? 'Fixed Amount ($)' : 'BOGO / Free Delivery'),
                'value' => $promo->discount_type === 'percentage' ? $promo->discount_value . '% Off' : '$' . number_format($promo->discount_value, 2) . ' Off',
                'validDates' => Carbon::parse($promo->start_date)->format('M j') . ' - ' . Carbon::parse($promo->end_date)->format('M j, Y'),
                'status' => $promo->computed_status,
                'raw_start_date' => Carbon::parse($promo->start_date)->format('Y-m-d'),
                'raw_end_date' => Carbon::parse($promo->end_date)->format('Y-m-d'),
                'discount_value' => $promo->discount_value,
                'minimum_order_value' => $promo->minimum_order_value,
            ];
        }));
    }

    public function store(Request $request)
    {
        $owner = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:promotions,code|max:50',
            'discount_type' => 'required|string|in:percentage,fixed,bogo,free_delivery',
            'discount_value' => 'required|numeric|min:0',
            'minimum_order_value' => 'nullable|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $promo = Promotion::create([
            'name' => $validated['name'],
            'code' => strtoupper($validated['code']),
            'discount_type' => $validated['discount_type'],
            'discount_value' => $validated['discount_value'],
            'minimum_order_value' => $validated['minimum_order_value'],
            'applicability_type' => 'all_items', // simplified for owner
            'applicable_restaurants' => [(int) $owner->id], // ENFORCE OWNER ID
            'start_date' => Carbon::parse($validated['start_date'])->startOfDay(),
            'end_date' => Carbon::parse($validated['end_date'])->endOfDay(),
            'status' => 'active', // Let it evaluate dynamically
        ]);

        return response()->json(['message' => 'Promotion created successfully', 'promotion' => $promo], 201);
    }

    public function update(Request $request, $id)
    {
        $owner = $request->user();
        
        $promo = Promotion::where('id', $id)
            ->whereJsonContains('applicable_restaurants', $owner->id)
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|max:50|unique:promotions,code,'.$id,
            'discount_value' => 'sometimes|numeric|min:0',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
        ]);

        if (isset($validated['start_date'])) {
            $validated['start_date'] = Carbon::parse($validated['start_date'])->startOfDay();
        }
        if (isset($validated['end_date'])) {
            $validated['end_date'] = Carbon::parse($validated['end_date'])->endOfDay();
        }

        $promo->update($validated);

        return response()->json(['message' => 'Promotion updated', 'promotion' => $promo]);
    }

    public function destroy(Request $request, $id)
    {
        $owner = $request->user();
        
        $promo = Promotion::where('id', $id)
            ->whereJsonContains('applicable_restaurants', clone $owner->id)
            ->orWhere(function($query) use ($id, $owner) {
                $query->where('id', $id)->whereJsonContains('applicable_restaurants', strval($owner->id));
            })
            ->firstOrFail();

        $promo->delete();
        return response()->json(['message' => 'Promotion deleted']);
    }
}
