<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Order;

$users = User::all();
echo "USERS IN DB: " . $users->count() . "\n";
foreach ($users as $u) {
    echo "ID: {$u->id} | Name: {$u->name} | Email: {$u->email} | Address: " . ($u->address ?? 'NULL') . "\n";
}

$orders = Order::all();
echo "\nORDERS IN DB: " . $orders->count() . "\n";
foreach ($orders as $o) {
    echo "ID: {$o->id} | Customer: {$o->customer_id} | Address: {$o->delivery_address}\n";
}
