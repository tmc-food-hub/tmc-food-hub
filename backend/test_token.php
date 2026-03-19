<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$token = \Laravel\Sanctum\PersonalAccessToken::latest()->first();
echo "Token ID: " . $token->id . "\n";
echo "Tokenable Type: " . $token->tokenable_type . "\n";
echo "Tokenable ID: " . $token->tokenable_id . "\n";
