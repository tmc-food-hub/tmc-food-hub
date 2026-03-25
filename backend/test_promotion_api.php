<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    // Test creating a promotion
    $promo = \App\Models\Promotion::create([
        'name' => 'Test Promotion',
        'code' => 'TEST20_' . time(),
        'discount_type' => 'percentage',
        'discount_value' => 20,
        'minimum_order_value' => 100,
        'applicability_type' => 'all_items',
        'start_date' => now(),
        'end_date' => now()->addMonth(),
        'status' => 'active'
    ]);
    echo "✓ Created test promotion: " . $promo->id . "\n";
    
    // Test querying
    $count = \App\Models\Promotion::count();
    echo "✓ Total promotions: " . $count . "\n";
    
    // Test active scope
    $active = \App\Models\Promotion::active()->count();
    echo "✓ Active promotions: " . $active . "\n";
    
    // Test fetching the promotion
    $fetched = \App\Models\Promotion::find($promo->id);
    echo "✓ Fetched promotion: " . $fetched->name . "\n";
    
    // Test status computation
    echo "✓ Computed status: " . $fetched->computed_status . "\n";
    
    echo "\n✓ All database tests PASSED!\n";
    
} catch (\Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
}
