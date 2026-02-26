<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ContactController;
use App\Http\Controllers\Api\SupportController;
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    // Public route - anyone can submit contact form
    Route::post('contact', [ContactController::class, 'store']);
    
    // Admin routes - view/manage contacts
    Route::get('contacts', [ContactController::class, 'index']);
    Route::get('contacts/{id}', [ContactController::class, 'show']);
    Route::delete('contacts/{id}', [ContactController::class, 'destroy']);
    
});

Route::get('/support/topics', [SupportController::class, 'topics']);
Route::post('/support', [SupportController::class, 'store']);