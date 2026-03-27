<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlatformSettings extends Model
{
    use HasFactory;

    protected $table = 'platform_settings';

    protected $fillable = [
        'platform_status',
        'platform_name',
        'tagline',
        'support_email',
        'phone_number',
        'logo_url',
        'favicon_url',
        'currency',
        'language',
        'timezone',
        'default_commission_rate',
        'commission_type',
        'tiered_commission',
        'delivery_mode',
        'platform_delivery_fee',
        'minimum_order_value',
        'payment_cashless_enabled',
        'payment_cash_enabled',
        'payment_gcash_enabled',
        'payment_paypal_enabled',
        'notify_new_orders',
        'notify_disputes',
        'notify_reviews',
        'notify_promotions',
        'terms_of_service',
        'privacy_policy',
        'refund_policy',
        'meta_title',
        'meta_description',
        'meta_keywords',
    ];

    protected $casts = [
        'tiered_commission' => 'array',
        'payment_cashless_enabled' => 'boolean',
        'payment_cash_enabled' => 'boolean',
        'payment_gcash_enabled' => 'boolean',
        'payment_paypal_enabled' => 'boolean',
        'notify_new_orders' => 'boolean',
        'notify_disputes' => 'boolean',
        'notify_reviews' => 'boolean',
        'notify_promotions' => 'boolean',
    ];

    /**
     * Get the single settings record or create default
     */
    public static function getSettings()
    {
        return self::firstOrCreate(
            ['id' => 1],
            [
                'platform_status' => 'live',
                'platform_name' => 'TMC Foodhub',
                'tagline' => 'Your Cravings, Delivered. Anytime.',
                'support_email' => 'support@tmcfoodhub.com',
                'phone_number' => '+63 2 8123 4567',
                'currency' => 'PHP',
                'language' => 'English',
                'timezone' => 'Asia/Manila',
                'default_commission_rate' => 15.00,
                'commission_type' => 'percentage',
            ]
        );
    }

    /**
     * Update general settings
     */
    public static function updateGeneral(array $data)
    {
        $settings = self::getSettings();
        $settings->update($data);
        return $settings;
    }
}
