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
    ];

    protected $casts = [
        'two_factor_auth' => 'boolean',
        'email_alerts' => 'boolean',
        'sms_emergency' => 'boolean',
    ];

    public static function getSettings()
    {
        return self::first() ?? self::create([
            'two_factor_auth' => true,
            'email_alerts' => true,
            'sms_emergency' => true,
            'session_timeout' => '30 minutes',
            'max_login_attempts' => 5,
        ]);
    }

    public static function updateSettings(array $data)
    {
        $settings = self::getSettings();
        $settings->fill($data)->save();
        return $settings;
    }
}
