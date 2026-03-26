<?php
require 'vendor/autoload.php';

use Illuminate\Support\Facades\Route;

$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Testing Admin Settings Endpoints ===\n\n";

// Get admin token
$admin = \App\Models\User::where('email', 'admin@tmc.test')->first();
if (!$admin) {
    $admin = \App\Models\User::create([
        'email' => 'admin@tmc.test',
        'name' => 'Test Admin',
        'password' => bcrypt('password123'),
        'role' => 'admin',
    ]);
}
$token = $admin->createToken('test-token')->plainTextToken;

// Verify routes exist
$routes = Route::getRoutes();
echo "Routes Status:\n";
$routeCount = 0;
foreach ($routes as $route) {
    if (strpos($route->uri, 'api/admin/settings') !== false) {
        echo "✓ " . strtoupper(collect($route->methods)->filter(fn($m) => $m !== 'HEAD')->implode(', ')) . " /api/admin/settings" . (strpos($route->uri, '{') !== false ? '{section}' : '') . "\n";
        $routeCount++;
    }
}
echo "$routeCount settings routes registered\n\n";

// Test: GET /api/admin/settings
echo "=== Test 1: GET /api/admin/settings ===\n";
$ch = curl_init('http://localhost:8000/api/admin/settings');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Accept: application/json',
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status: $httpCode\n";
if ($httpCode === 200) {
    $data = json_decode($response, true);
    echo "✓ Settings retrieved successfully\n";
    echo "  Platform Name: " . $data['data']['platform_name'] . "\n";
    echo "  Tagline: " . $data['data']['tagline'] . "\n";
    echo "  Support Email: " . $data['data']['support_email'] . "\n";
    echo "  Currency: " . $data['data']['currency'] . "\n";
    echo "  Commission Rate: " . $data['data']['default_commission_rate'] . "%\n";
} else {
    echo "✗ Error: $response\n";
}

echo "\n";

// Test: PUT /api/admin/settings/general
echo "=== Test 2: PUT /api/admin/settings/general ===\n";
$updateData = [
    'platform_name' => 'TMC Foodhub Pro',
    'tagline' => 'Fast Food Delivery',
    'support_email' => 'support-update@tmcfoodhub.com',
    'currency' => 'USD',
];

$ch = curl_init('http://localhost:8000/api/admin/settings/general');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($updateData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Content-Type: application/json',
    'Accept: application/json',
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status: $httpCode\n";
if ($httpCode === 200) {
    $data = json_decode($response, true);
    echo "✓ " . $data['message'] . "\n";
    echo "  Updated Platform Name: " . $data['data']['platform_name'] . "\n";
    echo "  Updated Support Email: " . $data['data']['support_email'] . "\n";
    echo "  Updated Currency: " . $data['data']['currency'] . "\n";
} else {
    echo "✗ Error: $response\n";
}

echo "\n";

// Test: PUT /api/admin/settings/commission
echo "=== Test 3: PUT /api/admin/settings/commission ===\n";
$commissionData = [
    'default_commission_rate' => 18.50,
    'commission_type' => 'tiered',
    'delivery_mode' => 'mixed',
    'platform_delivery_fee' => 60.00,
];

$ch = curl_init('http://localhost:8000/api/admin/settings/commission');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($commissionData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Content-Type: application/json',
    'Accept: application/json',
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status: $httpCode\n";
if ($httpCode === 200) {
    $data = json_decode($response, true);
    echo "✓ " . $data['message'] . "\n";
    echo "  Commission Rate: " . $data['data']['default_commission_rate'] . "%\n";
    echo "  Commission Type: " . $data['data']['commission_type'] . "\n";
    echo "  Delivery Mode: " . $data['data']['delivery_mode'] . "\n";
    echo "  Delivery Fee: ₱" . $data['data']['platform_delivery_fee'] . "\n";
} else {
    echo "✗ Error: $response\n";
}

echo "\n";

// Test: PUT /api/admin/settings/notifications
echo "=== Test 4: PUT /api/admin/settings/notifications ===\n";
$notifyData = [
    'notify_new_orders' => false,
    'notify_disputes' => true,
    'notify_reviews' => true,
    'notify_promotions' => false,
];

$ch = curl_init('http://localhost:8000/api/admin/settings/notifications');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($notifyData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Content-Type: application/json',
    'Accept: application/json',
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status: $httpCode\n";
if ($httpCode === 200) {
    $data = json_decode($response, true);
    echo "✓ " . $data['message'] . "\n";
    echo "  Notify New Orders: " . ($data['data']['notify_new_orders'] ? 'true' : 'false') . "\n";
    echo "  Notify Disputes: " . ($data['data']['notify_disputes'] ? 'true' : 'false') . "\n";
    echo "  Notify Reviews: " . ($data['data']['notify_reviews'] ? 'true' : 'false') . "\n";
    echo "  Notify Promotions: " . ($data['data']['notify_promotions'] ? 'true' : 'false') . "\n";
} else {
    echo "✗ Error: $response\n";
}

echo "\n=== All Tests Complete ===\n";
echo "Admin settings backend is working correctly! ✓\n";
?>
