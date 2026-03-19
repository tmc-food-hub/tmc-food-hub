<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$order = App\Models\Order::find(17);
echo "Order found: " . ($order ? "Yes" : "No") . "\n";
if ($order) {
    echo "Order ID: " . $order->id . "\n";
    echo "Order store_name: " . $order->store_name . "\n";
    echo "Order restaurant_owner_id: " . $order->restaurant_owner_id . "\n";
    
    $owner = App\Models\RestaurantOwner::find($order->restaurant_owner_id);
    echo "Owner found: " . ($owner ? "Yes" : "No") . "\n";
    if ($owner) {
        echo "Owner Name: " . $owner->restaurant_name . "\n";
        echo "Owner ID: " . $owner->id . "\n";
    }
}
