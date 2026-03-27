<?php

namespace App\Models;

use App\Support\MediaPath;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'customer_id',
        'restaurant_owner_id',
        'store_name',
        'subtotal',
        'delivery_fee',
        'discount',
        'total',
        'payment_method',
        'delivery_address',
        'contact_number',
        'special_instructions',
        'delivery_type',
        'scheduled_date',
        'scheduled_time',
        'status',
        'payment_status',
        'payment_receipt',
        'payment_sender_name',
        'payment_transaction_id'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function restaurantOwner()
    {
        return $this->belongsTo(RestaurantOwner::class, 'restaurant_owner_id');
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    public function getPaymentReceiptAttribute($value)
    {
        return MediaPath::toPublicUrl($value);
    }
}
