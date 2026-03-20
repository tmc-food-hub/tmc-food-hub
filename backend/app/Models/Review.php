<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'restaurant_owner_id',
        'customer_id',
        'order_id',
        'rating',
        'review',
        'photos',
        'is_verified',
        'helpful_count',
        'owner_reply',
        'owner_replied_at',
    ];

    protected function casts(): array
    {
        return [
            'photos' => 'array',
            'is_verified' => 'boolean',
            'owner_replied_at' => 'datetime',
        ];
    }

    public function owner()
    {
        return $this->belongsTo(RestaurantOwner::class, 'restaurant_owner_id');
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function helpfulVotes()
    {
        return $this->hasMany(ReviewHelpfulVote::class);
    }
}
