<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| The Nivora REST API. Every endpoint is served under the "/api" prefix,
| which is configured in bootstrap/app.php. Feature-specific routes are
| added here as the API is built out.
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

// Current authenticated user (Sanctum token required).
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
