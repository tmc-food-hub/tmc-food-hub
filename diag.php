<?php
require 'backend/vendor/autoload.php';
$app = require_once 'backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "--- OWNERS ---\n";
foreach(App\Models\RestaurantOwner::all() as $o) {
    echo "ID: {$o->id} | Name: [{$o->restaurant_name}] | Email: {$o->email}\n";
}

echo "\n--- MENU ITEMS (KFC & JOLLIBEE) ---\n";
foreach(App\Models\MenuItem::whereIn('restaurant_owner_id', [1, 5])->get() as $i) {
    echo "RestID: {$i->restaurant_owner_id} | Title: {$i->title} | Price: {$i->price} | Image: [{$i->image}]\n";
}
