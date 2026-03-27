<?php

echo "=== Verifying Seeded Admin Users ===\n\n";

// Load Laravel
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

$admins = User::where('role', '!=', 'customer')
    ->where('role', '!=', 'restaurant_owner')
    ->select('id', 'name', 'email', 'role', 'status', 'last_active', 'created_at')
    ->orderBy('created_at', 'desc')
    ->get();

echo "Total admin users: " . count($admins) . "\n\n";

if (count($admins) > 0) {
    echo "Admin List:\n";
    echo str_pad("Name", 25) . str_pad("Email", 35) . str_pad("Role", 15) . "Status\n";
    echo str_repeat("-", 90) . "\n";
    
    foreach ($admins as $admin) {
        echo str_pad($admin->name, 25) 
            . str_pad($admin->email, 35) 
            . str_pad($admin->role, 15) 
            . ($admin->status ?? 'Active') . "\n";
    }
} else {
    echo "No admin users found.\n";
}

echo "\n=== Verification Complete ===\n";
