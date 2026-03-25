<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "=== Creating/Updating Test Admin ===\n\n";

// Check if admin exists
$admin = User::where('email', 'admin@tmc.test')->where('role', 'admin')->first();

if ($admin) {
    echo "✓ Admin already exists with email: admin@tmc.test\n";
} else {
    // Create admin if doesn't exist
    $admin = User::create([
        'name' => 'Test Admin',
        'email' => 'admin@tmc.test',
        'password' => Hash::make('password123'),
        'phone' => '1234567890',
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);
    echo "✓ Created admin user: admin@tmc.test\n";
}

echo "\nAdmin Details:\n";
echo "  Email: {$admin->email}\n";
echo "  Role: {$admin->role}\n";
echo "  ID: {$admin->id}\n";

// Create a token for testing
echo "\n=== Creating Test Token ===\n";
$token = $admin->createToken('admin-test-token')->plainTextToken;
echo "Token: {$token}\n";

// Test the API with the token
echo "\n=== Testing Promotions API ===\n";

$url = 'http://localhost:8000/api/admin/promotions';
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'Authorization: Bearer ' . $token,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status: {$httpCode}\n";
echo "Response:\n";
echo json_encode(json_decode($response, true), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";

echo "\n=== Store in localStorage ===\n";
echo "To test in browser console, run:\n";
echo "localStorage.setItem('admin_auth_token', '{$token}');\n";
echo "Then reload the page.\n";
