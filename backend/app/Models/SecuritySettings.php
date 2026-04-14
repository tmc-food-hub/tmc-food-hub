<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SecuritySettings extends Model
{
    protected $table = 'security_settings';

    protected $fillable = [
        'two_factor_auth',
        'email_alerts',
        'sms_emergency',
        'session_timeout',
        'max_login_attempts',
        'require_uppercase',
        'require_numbers',
        'require_special_character',
        'password_expiry_days',
    ];

    protected $casts = [
        'two_factor_auth' => 'boolean',
        'email_alerts' => 'boolean',
        'sms_emergency' => 'boolean',
        'require_uppercase' => 'boolean',
        'require_numbers' => 'boolean',
        'require_special_character' => 'boolean',
        'max_login_attempts' => 'integer',
        'password_expiry_days' => 'integer',
    ];

    public static function getSettings()
    {
        return self::first() ?? self::create([
            'two_factor_auth' => true,
            'email_alerts' => true,
            'sms_emergency' => true,
            'session_timeout' => '30 minutes',
            'max_login_attempts' => 5,
            'require_uppercase' => true,
            'require_numbers' => true,
            'require_special_character' => true,
            'password_expiry_days' => 90,
        ]);
    }

    public static function updateSettings(array $data)
    {
        $settings = self::getSettings();
        $settings->fill($data)->save();
        return $settings;
    }
}
