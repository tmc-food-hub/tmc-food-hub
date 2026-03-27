<?php

namespace App\Models;

use App\Support\MediaPath;
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

    public function getPhotosAttribute($value): array
    {
        $photos = is_array($value) ? $value : json_decode($value ?? '[]', true);

        if (!is_array($photos)) {
            return [];
        }

        return array_values(array_map(
            fn ($photo) => MediaPath::toPublicUrl($photo),
            array_filter($photos, fn ($photo) => is_string($photo) && trim($photo) !== '')
        ));
    }
}
