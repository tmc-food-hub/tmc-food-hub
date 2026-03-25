<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Get the router and print all admin routes
$router = $app->make('router');

echo "=== All Admin Promotion Routes ===\n\n";

$routes = $router->getRoutes();
foreach ($routes as $route) {
    if (strpos($route->uri(), 'admin/promotions') !== false) {
        echo "Method: " . implode('|', $route->methods()) . "\n";
        echo "URI: " . $route->uri() . "\n";
        echo "Action: " . json_encode($route->action) . "\n";
        echo "---\n";
    }
}

echo "\n=== Total Routes ===\n";
echo "Total routes: " . count($routes->getIterator()) . "\n";

// Check if any admin routes exist
$adminRoutes = array_filter($routes->getIterator(), function($route) {
    return strpos($route->uri(), 'admin') !== false;
});

echo "Admin routes: " . count($adminRoutes) . "\n";
