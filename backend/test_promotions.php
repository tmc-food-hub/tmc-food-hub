<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Test database connection
try {
    $count = \App\Models\Promotion::count();
    echo "✓ Database connected successfully\n";
    echo "✓ Promotions table has " . $count . " records\n";
    
    // Test Promotion model functionality
    $promotion = new \App\Models\Promotion();
    echo "✓ Promotion model loaded successfully\n";
    
    // List all columns
    $columns = \Illuminate\Support\Facades\Schema::getColumnListing('promotions');
    echo "✓ Promotions table columns: " . count($columns) . "\n";
    echo "  - " . implode("\n  - ", $columns) . "\n";
    
} catch (\Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
