<?php

namespace App\Models;

use App\Support\MediaPath;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        return MediaPath::toPublicUrl($value);
    }

    public function variations()
    {
        return $this->hasMany(MenuItemVariation::class);
    }

    public function addOns()
    {
        return $this->hasMany(MenuItemAddOn::class);
    }
}
