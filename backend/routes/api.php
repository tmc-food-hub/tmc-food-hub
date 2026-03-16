<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OwnerAuthController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\MenuController;
use Illuminate\Support\Facades\Route;

// ── Public Auth Routes ────────────────────────────────────────────────────
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/send-otp', [AuthController::class, 'sendOtp'])->middleware('throttle:5,1');
Route::post('/verify-otp', [AuthController::class, 'verifyOtp'])->middleware('throttle:10,1');

// ── Owner Auth Routes ─────────────────────────────────────────────────────
Route::post('/owner/login', [OwnerAuthController::class, 'login']);
Route::post('/owner/register', [OwnerAuthController::class, 'register']);

// ── Public Menu / Restaurant Browse Routes (customer-facing) ─────────────
Route::get('/restaurants', [MenuController::class, 'index']);
Route::get('/restaurants/{id}/menu', [MenuController::class, 'show']);

// ── Customer Authenticated Routes ─────────────────────────────────────────
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:5,1');
Route::post('/verify-reset-otp', [AuthController::class, 'verifyResetOtp'])->middleware('throttle:10,1');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Orders — customer places orders; controller checks role/model type internally
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
});

// ── Owner Authenticated Routes ────────────────────────────────────────────
Route::middleware('auth:sanctum')->prefix('owner')->group(function () {
    Route::get('/user', [OwnerAuthController::class, 'user']);
    Route::put('/user', [OwnerAuthController::class, 'updateProfile']);
    Route::post('/logout', [OwnerAuthController::class, 'logout']);

    // Owner also uses the shared /orders endpoint — OrderController detects RestaurantOwner model
    Route::get('/orders', [OrderController::class, 'index']);
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

    // Inventory Management
    Route::get('/inventory/categories', [InventoryController::class, 'getCategories']);
    Route::post('/inventory/categories', [InventoryController::class, 'storeCategory']);
    Route::delete('/inventory/categories/{id}', [InventoryController::class, 'destroyCategory']);

    Route::get('/inventory/items', [InventoryController::class, 'getMenuItems']);
    Route::post('/inventory/items', [InventoryController::class, 'storeMenuItem']);
    Route::put('/inventory/items/{id}', [InventoryController::class, 'updateMenuItem']);
    Route::patch('/inventory/items/{id}/stock', [InventoryController::class, 'updateStock']);
    Route::patch('/inventory/items/{id}/availability', [InventoryController::class, 'toggleAvailability']);
});

