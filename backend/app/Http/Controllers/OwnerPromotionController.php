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
        $ownerId = (int) $owner->id;
        
        // Fetch promotions where applicable_restaurants contains the owner's ID
        // Check both int and string representations for JSON compatibility
        $promotions = Promotion::where(function ($query) use ($ownerId) {
            $query->whereJsonContains('applicable_restaurants', $ownerId)
                  ->orWhereJsonContains('applicable_restaurants', (string) $ownerId);
        })->get();
            
        // Map over them to format nicely
        return response()->json($promotions->map(function ($promo) {
            $start = Carbon::parse($promo->start_date);
            $end = Carbon::parse($promo->end_date);

            return [
                'id' => $promo->id,
                'name' => $promo->name,
                'code' => $promo->code,
                'appliesTo' => $promo->applicability_type === 'all_items' ? 'All Items' : 'Specific Items',
                'type' => $promo->discount_type === 'percentage' ? 'Percentage Off (%)' : ($promo->discount_type === 'fixed' ? 'Fixed Amount ($)' : 'BOGO / Free Delivery'),
                'value' => $promo->discount_type === 'percentage' ? $promo->discount_value . '% Off' : '$' . number_format($promo->discount_value, 2) . ' Off',
                'validDates' => $start->format('M j, g:i A') . ' – ' . $end->format('M j, Y g:i A'),
                'status' => $promo->computed_status,
                'raw_status' => $promo->status,
                'raw_start_date' => $start->format('Y-m-d\TH:i'),
                'raw_end_date' => $end->format('Y-m-d\TH:i'),
                'discount_type' => $promo->discount_type,
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
            'status' => 'nullable|string|in:active,scheduled,inactive',
        ]);

        // Determine status: if 'active' was requested and start <= now, set active
        $startDt = Carbon::parse($validated['start_date']);
        $status = $request->input('status', 'active');
        if ($status === 'active' && $startDt->isFuture()) {
            $status = 'scheduled';
        }

        $promo = Promotion::create([
            'name' => $validated['name'],
            'code' => strtoupper($validated['code']),
            'discount_type' => $validated['discount_type'],
            'discount_value' => $validated['discount_value'],
            'minimum_order_value' => $validated['minimum_order_value'] ?? null,
            'applicability_type' => 'all_items',
            'applicable_restaurants' => [(int) $owner->id],
            'start_date' => $startDt,
            'end_date' => Carbon::parse($validated['end_date']),
            'status' => $status,
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
            'discount_type' => 'sometimes|string|in:percentage,fixed,bogo,free_delivery',
            'discount_value' => 'sometimes|numeric|min:0',
            'minimum_order_value' => 'nullable|numeric|min:0',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'status' => 'sometimes|string|in:active,scheduled,inactive',
        ]);

        if (isset($validated['start_date'])) {
            $validated['start_date'] = Carbon::parse($validated['start_date']);
        }
        if (isset($validated['end_date'])) {
            $validated['end_date'] = Carbon::parse($validated['end_date']);
        }

        $promo->update($validated);

        return response()->json(['message' => 'Promotion updated', 'promotion' => $promo->fresh()]);
    }

    public function destroy(Request $request, $id)
    {
        $owner = $request->user();
        $ownerId = (int) $owner->id;
        
        $promo = Promotion::where('id', $id)
            ->where(function ($query) use ($ownerId) {
                $query->whereJsonContains('applicable_restaurants', $ownerId)
                      ->orWhereJsonContains('applicable_restaurants', (string) $ownerId);
            })
            ->firstOrFail();

        $promo->delete();
        return response()->json(['message' => 'Promotion deleted']);
    }
}
