<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/adminer', function () {
    ob_start();
    include __DIR__ . '/../public/adminer-wrapper.php';
    return ob_get_clean();
});
