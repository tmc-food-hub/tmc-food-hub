<?php
require 'vendor/autoload.php';

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Testing Expiring Promotions Endpoints ===\n\n";

// Get all routes
$routes = Route::getRoutes();
$expiringRoute = null;
$extendRoute = null;

foreach ($routes as $route) {
    if (strpos($route->uri, 'api/admin/promotions') !== false) {
        if (strpos($route->uri, 'expiring') !== false) {
            $expiringRoute = $route;
        }
        if (strpos($route->uri, 'extend') !== false) {
            $extendRoute = $route;
        }
    }
}

echo "Routes Status:\n";
if ($expiringRoute) {
    echo "✓ GET /api/admin/promotions/expiring/soon - " . collect($expiringRoute->methods)->implode(', ') . "\n";
} else {
    echo "✗ GET /api/admin/promotions/expiring/soon - NOT FOUND\n";
}

if ($extendRoute) {
    echo "✓ POST /api/admin/promotions/{id}/extend - " . collect($extendRoute->methods)->implode(', ') . "\n";
} else {
    echo "✗ POST /api/admin/promotions/{id}/extend - NOT FOUND\n";
}

echo "\nTesting with Bearer Token...\n\n";

// First, create or get admin token
$admin = \App\Models\User::where('email', 'admin@tmc.test')->first();
if (!$admin) {
    echo "Creating test admin...\n";
    $admin = \App\Models\User::create([
        'email' => 'admin@tmc.test',
        'name' => 'Test Admin',
        'password' => bcrypt('password123'),
        'role' => 'admin',
    ]);
}

$token = $admin->createToken('test-token')->plainTextToken;
echo "Admin Token: $token\n\n";

// Create a test promotion expiring soon
$now = now();
$expiringDate = $now->copy()->addHours(24);

$promotion = \App\Models\Promotion::create([
    'name' => 'Test Expiring Promotion',
    'code' => 'TEST_EXPIRING_' . uniqid(),
    'discount_type' => 'percentage',
    'discount_value' => 15,
    'applicability_type' => 'all_items',
    'start_date' => $now->subHours(1),
    'end_date' => $expiringDate,
    'status' => 'active',
    'description' => 'Test promotion for expiring soon feature',
]);

echo "Created test promotion: {$promotion->name} (ID: {$promotion->id})\n";
echo "End date: {$promotion->end_date}\n\n";

// Test expiring promotions endpoint
echo "=== Testing GET /api/admin/promotions/expiring/soon ===\n";
$ch = curl_init('http://localhost:8000/api/admin/promotions/expiring/soon');
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
    echo "Response:\n";
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n\n";
} else {
    echo "Error: $response\n\n";
}

// Test extend promotion endpoint
echo "=== Testing POST /api/admin/promotions/{$promotion->id}/extend ===\n";
$newEndDate = $now->copy()->addDays(7);

$ch = curl_init("http://localhost:8000/api/admin/promotions/{$promotion->id}/extend");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'extend_by_days' => 7,
    'new_end_date' => $newEndDate->format('Y-m-d'),
]));
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
    echo "Response:\n";
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
    echo "\n✓ Promotion extended successfully!\n";
    echo "New end date: " . $data['data']['end_date'] . "\n";
} else {
    echo "Error: $response\n";
}

echo "\n=== Test Complete ===\n";
?>
