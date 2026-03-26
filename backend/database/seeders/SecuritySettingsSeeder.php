<?php

namespace Database\Seeders;

use App\Models\SecuritySettings;
use Illuminate\Database\Seeder;

class SecuritySettingsSeeder extends Seeder
{
    public function run(): void
    {
        SecuritySettings::create([
            'two_factor_auth' => true,
            'email_alerts' => true,
            'sms_emergency' => true,
            'session_timeout' => '30 minutes',
            'max_login_attempts' => 5,
        ]);
    }
}
