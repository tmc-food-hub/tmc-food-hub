<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'restaurant_owner_id',
        'name',
    ];

    public function owner()
    {
        return $this->belongsTo(RestaurantOwner::class, 'restaurant_owner_id');
    }

    public function menuItems()
    {
        return $this->hasMany(MenuItem::class);
    }
}
