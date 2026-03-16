<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminerController;

Route::get('/', function () {
    return view('welcome');
});

Route::match(['get', 'post'], '/adminer', [AdminerController::class, 'index']);
