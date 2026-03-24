<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OwnerAuthController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;

// ── Public Auth Routes ────────────────────────────────────────────────────
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/send-otp', [AuthController::class, 'sendOtp'])->middleware('throttle:5,1');
Route::post('/verify-otp', [AuthController::class, 'verifyOtp'])->middleware('throttle:10,1');

// ── Google OAuth Routes ────────────────────────────────────────────────────
Route::get('/auth/google', [GoogleAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);
Route::post('/auth/google-signup', [GoogleAuthController::class, 'signupWithToken']);
Route::post('/auth/google-login', [GoogleAuthController::class, 'loginWithToken']);

// ── Owner Auth Routes ─────────────────────────────────────────────────────
Route::post('/owner/login', [OwnerAuthController::class, 'login']);
Route::post('/owner/register', [OwnerAuthController::class, 'register']);
Route::post('/owner/send-otp', [OwnerAuthController::class, 'sendOtp'])->middleware('throttle:5,1');
Route::post('/owner/verify-otp', [OwnerAuthController::class, 'verifyOtp'])->middleware('throttle:10,1');
Route::post('/admin/login', [AdminController::class, 'login']);

// ── Public Menu / Restaurant Browse Routes (customer-facing) ─────────────
Route::get('/restaurants', [MenuController::class, 'index']);
Route::get('/restaurants/{id}/menu', [MenuController::class, 'show']);
Route::get('/restaurants/{id}/reviews', [ReviewController::class, 'index']);

// ── Customer Password Reset Routes ────────────────────────────────────────
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:5,1');
Route::post('/verify-reset-otp', [AuthController::class, 'verifyResetOtp'])->middleware('throttle:10,1');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:5,1');

// ── Customer Authenticated Routes ─────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'updateProfile']);
    Route::post('/user/password', [AuthController::class, 'changePassword'])->middleware('throttle:5,1');
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/restaurants/{id}/reviewable-orders', [ReviewController::class, 'reviewableOrders']);
    Route::post('/restaurants/{id}/reviews', [ReviewController::class, 'store']);
    Route::post('/reviews/{review}/helpful', [ReviewController::class, 'toggleHelpful']);

    // Customer: place orders and view/cancel their own orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
});

// ── Owner Authenticated Routes ────────────────────────────────────────────
Route::middleware('auth:owners')->prefix('owner')->group(function () {
    Route::get('/user', [OwnerAuthController::class, 'user']);
    Route::put('/user', [OwnerAuthController::class, 'updateProfile']);
    Route::put('/store-operations', [OwnerAuthController::class, 'updateStoreOperations']);
    Route::post('/profile-update', [OwnerAuthController::class, 'updateProfile']);
    Route::post('/logout', [OwnerAuthController::class, 'logout']);

    // Owner: fetch only their restaurant's orders and update status
    Route::get('/orders', [OrderController::class, 'index']);
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

    // Inventory Management — Categories
    Route::get('/inventory/categories', [InventoryController::class, 'getCategories']);
    Route::post('/inventory/categories', [InventoryController::class, 'storeCategory']);
    Route::delete('/inventory/categories/{id}', [InventoryController::class, 'destroyCategory']);

    // Inventory Management — Menu Items
    Route::get('/inventory/items', [InventoryController::class, 'getMenuItems']);
    Route::post('/inventory/items', [InventoryController::class, 'storeMenuItem']);
    Route::put('/inventory/items/{id}', [InventoryController::class, 'updateMenuItem']);
    Route::delete('/inventory/items/{id}', [InventoryController::class, 'destroyMenuItem']);
    Route::patch('/inventory/items/{id}/stock', [InventoryController::class, 'updateStock']);
    Route::patch('/inventory/items/{id}/availability', [InventoryController::class, 'toggleAvailability']);
    Route::get('/reviews', [ReviewController::class, 'ownerIndex']);
    Route::post('/reviews/{review}/reply', [ReviewController::class, 'reply']);
});

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/user', [AdminController::class, 'user']);
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/orders', [AdminController::class, 'orders']);
    Route::get('/customers', [AdminController::class, 'customers']);
    Route::get('/restaurants', [AdminController::class, 'restaurants']);
    Route::get('/reviews', [AdminController::class, 'reviews']);
    Route::get('/payments', [AdminController::class, 'payments']);
    Route::get('/analytics', [AdminController::class, 'analytics']);
    Route::get('/disputes', [AdminController::class, 'disputes']);
    Route::get('/settings', [AdminController::class, 'settings']);
    Route::post('/logout', [AdminController::class, 'logout']);
});
