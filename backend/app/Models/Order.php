<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'customer_id',
        'store_name',
        'subtotal',
        'delivery_fee',
        'discount',
        'total',
        'payment_method',
        'delivery_address',
        'contact_number',
        'special_instructions',
        'status'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }
}
