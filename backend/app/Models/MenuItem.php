<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'restaurant_owner_id',
        'category_id',
        'title',
        'description',
        'price',
        'image',
        'available',
        'stock_level',
        'min_threshold',
        'unit',
        'auto_toggle',
    ];

    public function owner()
    {
        return $this->belongsTo(RestaurantOwner::class, 'restaurant_owner_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function getImageAttribute($value)
    {
        return $this->normalizeMediaPath($value);
    }

    private function normalizeMediaPath($value)
    {
        if (!$value || !is_string($value)) {
            return $value;
        }

        if (preg_match('/^https?:\/\//i', $value)) {
            $path = parse_url($value, PHP_URL_PATH);
            return $path ?: $value;
        }

        if (str_starts_with($value, 'storage/')) {
            return '/' . $value;
        }

        return $value;
    }
}
