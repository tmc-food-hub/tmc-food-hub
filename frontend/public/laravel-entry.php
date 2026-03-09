<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Path from public_html/ up to backend-app/
require __DIR__ . '/../backend-app/vendor/autoload.php';

$app = require_once __DIR__ . '/../backend-app/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
)->send();

$kernel->terminate($request, $response);
