<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * One admin account and one demo customer account, driven by env
     * vars so real credentials never need to be hard-coded (see
     * .env.example ADMIN_* / DEMO_* — assessment-only defaults).
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@nivora.test')],
            [
                'name' => env('ADMIN_NAME', 'Nivora Admin'),
                'password' => env('ADMIN_PASSWORD', 'password'),
                'is_admin' => true,
                'email_verified_at' => now(),
            ],
        );

        User::updateOrCreate(
            ['email' => env('DEMO_EMAIL', 'customer@nivora.test')],
            [
                'name' => env('DEMO_NAME', 'Demo Customer'),
                'password' => env('DEMO_PASSWORD', 'password'),
                'is_admin' => false,
                'email_verified_at' => now(),
            ],
        );
    }
}
