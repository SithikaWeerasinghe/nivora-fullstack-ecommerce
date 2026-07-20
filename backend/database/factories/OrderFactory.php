<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 20, 300);

        return [
            'user_id' => User::factory(),
            'order_number' => 'NIV-'.now()->format('Ymd').'-'.fake()->unique()->numberBetween(1000, 9999),
            'status' => 'confirmed',
            'subtotal' => $subtotal,
            'total_amount' => $subtotal,
            'shipping_name' => fake()->name(),
            'shipping_phone' => fake()->phoneNumber(),
            'shipping_address' => fake()->address(),
        ];
    }
}
