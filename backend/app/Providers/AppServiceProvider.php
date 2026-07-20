<?php

namespace App\Providers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Single-resource responses (User, Product, Cart, Order, ...) are
        // returned unwrapped to match the frontend's TypeScript contracts
        // in frontend/src/types/index.ts. Paginated collections still
        // include their own "data"/"meta" keys regardless of this setting.
        JsonResource::withoutWrapping();
    }
}
