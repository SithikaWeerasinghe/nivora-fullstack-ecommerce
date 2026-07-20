<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CartItemController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| The Nivora REST API. Every endpoint is served under the "/api" prefix,
| which is configured in bootstrap/app.php.
|
*/

// Health check — a lightweight liveness probe for the API and its config.
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'Nivora API',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// ---- Authentication ----
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// ---- Categories ----
Route::get('/categories', [CategoryController::class, 'index']);
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::patch('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
});

// ---- Products ----
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::patch('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
});

// ---- Cart ----
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cart', [CartController::class, 'show']);
    Route::post('/cart/items', [CartItemController::class, 'store']);
    Route::patch('/cart/items/{cartItem}', [CartItemController::class, 'update']);
    Route::delete('/cart/items/{cartItem}', [CartItemController::class, 'destroy']);
});

// ---- Checkout & Orders ----
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/checkout', [CheckoutController::class, 'store']);
    Route::get('/orders/{orderNumber}', [OrderController::class, 'show']);
});
