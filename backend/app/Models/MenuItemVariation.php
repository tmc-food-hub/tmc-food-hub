<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItemVariation extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_item_id',
        'name',
        'price_opt',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'price_opt' => 'decimal:2',
    ];

    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class);
    }
}
