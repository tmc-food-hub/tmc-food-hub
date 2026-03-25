<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'discount_type',
        'discount_value',
        'minimum_order_value',
        'applicability_type',
        'applicable_categories',
        'applicable_restaurants',
        'start_date',
        'end_date',
        'status',
        'max_redemptions',
        'redemptions_count',
        'unique_customers_count',
        'conversion_rate',
        'total_revenue_lift',
        'description',
    ];

    protected $casts = [
        'applicable_categories' => 'array',
        'applicable_restaurants' => 'array',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'discount_value' => 'float',
        'minimum_order_value' => 'float',
        'conversion_rate' => 'float',
        'total_revenue_lift' => 'float',
    ];

    /**
     * Get the status based on current date
     */
    public function getComputedStatusAttribute()
    {
        $now = now();
        if ($this->status === 'inactive') {
            return 'Inactive';
        }
        if ($now < $this->start_date) {
            return 'Scheduled';
        }
        if ($now > $this->end_date) {
            return 'Expired';
        }
        return 'Active';
    }

    /**
     * Scope to get active promotions
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now());
    }

    /**
     * Scope to get scheduled promotions
     */
    public function scopeScheduled($query)
    {
        return $query->where('start_date', '>', now());
    }

    /**
     * Scope to get expired promotions
     */
    public function scopeExpired($query)
    {
        return $query->where('end_date', '<', now());
    }
}
