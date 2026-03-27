<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Seeder;

class ActivityLogSeeder extends Seeder
{
    public function run(): void
    {
        $admins = User::where('role', 'admin')->limit(5)->get();

        if ($admins->isEmpty()) {
            return;
        }

        $actions = [
            [
                'admin_id' => $admins[0]->id,
                'action' => 'Delete',
                'description' => "Deleted inactive vendor 'Spicy Hut #42'",
                'page' => 'Restaurant Management',
                'ip_address' => '192.168.1.100',
                'device' => 'macOS (Chrome)',
            ],
            [
                'admin_id' => $admins[1]->id,
                'action' => 'Update',
                'description' => 'Adjusted delivery radius to 15km for zone B2',
                'page' => 'Delivery Rules',
                'ip_address' => '172.16.0.50',
                'device' => 'Windows 11 (Edge)',
            ],
            [
                'admin_id' => $admins[2]->id,
                'action' => 'Access',
                'description' => "Downloaded 'Weekly Settlement Report'",
                'page' => 'Financials',
                'ip_address' => '10.0.0.75',
                'device' => 'Windows 10 (Chrome)',
            ],
            [
                'admin_id' => $admins[0]->id,
                'action' => 'Auth',
                'description' => 'Modified login attempts policy to 5 retries',
                'page' => 'Security Settings',
                'ip_address' => '45.72.100.200',
                'device' => 'Windows 10 (Chrome)',
            ],
            [
                'admin_id' => $admins[3]->id,
                'action' => 'Update',
                'description' => 'Flagged order #9942 for manual review',
                'page' => 'Orders',
                'ip_address' => '24.112.50.75',
                'device' => 'Windows 10 (Chrome)',
            ],
        ];

        foreach ($actions as $action) {
            ActivityLog::create($action);
        }
    }
}
