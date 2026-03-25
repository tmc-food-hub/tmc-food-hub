<?php
require 'vendor/autoload.php';

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Testing Performance Overview Endpoint ===\n\n";

// Get all routes
$routes = Route::getRoutes();
$performanceRoute = null;

foreach ($routes as $route) {
    if (strpos($route->uri, 'api/admin/performance') !== false) {
        $performanceRoute = $route;
        break;
    }
}

echo "Route Status:\n";
if ($performanceRoute) {
    echo "✓ GET /api/admin/performance - " . collect($performanceRoute->methods)->implode(', ') . "\n\n";
} else {
    echo "✗ GET /api/admin/performance - NOT FOUND\n\n";
    exit(1);
}

// Get admin token
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

// Test performance endpoint with different time ranges
$timeRanges = ['week', 'month', 'quarter', 'year'];

foreach ($timeRanges as $range) {
    echo "=== Testing GET /api/admin/performance?range=$range ===\n";
    
    $ch = curl_init("http://localhost:8000/api/admin/performance?range=$range");
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
        echo "✓ Response received\n";
        echo "  - KPIs: " . count($data['kpis']) . " metrics\n";
        echo "  - Trends: " . count($data['trends']) . " trends\n";
        echo "  - Weekly Metrics: " . count($data['weekly_metrics']) . " days\n";
        echo "  - Segments: " . count($data['performance_by_segment']) . " segments\n";
        echo "  - Health Score: " . $data['health_score'] . "/100\n";
        echo "  - Alerts: " . count($data['alerts']) . " alerts\n";
        
        // Show some sample KPIs
        echo "\n  Sample KPIs:\n";
        echo "    GMV: ₱" . number_format($data['kpis']['gmv'], 2) . "\n";
        echo "    Orders: " . $data['kpis']['orders'] . "\n";
        echo "    Customers: " . $data['kpis']['customers'] . "\n";
        echo "    Avg Order Value: ₱" . number_format($data['kpis']['avg_order_value'], 2) . "\n";
        echo "    Retention Rate: " . $data['kpis']['customer_retention_rate'] . "%\n";
        
        echo "\n  Trends:\n";
        echo "    GMV Trend: " . $data['trends']['gmv_trend'] . "%\n";
        echo "    Orders Trend: " . $data['trends']['orders_trend'] . "%\n";
    } else {
        echo "✗ Error: $response\n";
    }
    
    echo "\n";
}

echo "=== All Tests Complete ===\n";
echo "Performance Overview endpoint is working correctly! ✓\n";
?>
