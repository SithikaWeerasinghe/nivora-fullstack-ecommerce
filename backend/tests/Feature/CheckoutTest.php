<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    private array $shipping = [
        'shipping_name' => 'Jane Doe',
        'shipping_phone' => '0771234567',
        'shipping_address' => '123 Main St, Colombo',
    ];

    public function test_checkout_requires_authentication(): void
    {
        $this->postJson('/api/checkout', $this->shipping)->assertUnauthorized();
    }

    public function test_checkout_fails_with_an_empty_cart(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/checkout', $this->shipping)
            ->assertUnprocessable()
            ->assertJsonPath('message', 'Your cart is empty.');
    }

    public function test_checkout_requires_shipping_fields(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 5]);
        $this->actingAs($user)->postJson('/api/cart/items', ['product_id' => $product->id, 'quantity' => 1]);

        $this->actingAs($user)
            ->postJson('/api/checkout', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['shipping_name', 'shipping_phone', 'shipping_address']);
    }

    public function test_a_successful_checkout_creates_an_order_and_clears_the_cart(): void
    {
        $user = User::factory()->create();
        $productA = Product::factory()->create(['stock' => 10, 'price' => '20.00']);
        $productB = Product::factory()->create(['stock' => 5, 'price' => '15.50']);

        $this->actingAs($user)->postJson('/api/cart/items', ['product_id' => $productA->id, 'quantity' => 2]);
        $this->actingAs($user)->postJson('/api/cart/items', ['product_id' => $productB->id, 'quantity' => 1]);

        $response = $this->actingAs($user)->postJson('/api/checkout', $this->shipping);

        $response->assertCreated()
            ->assertJsonPath('status', 'confirmed')
            ->assertJsonPath('subtotal', '55.50')
            ->assertJsonPath('total_amount', '55.50')
            ->assertJsonCount(2, 'items');

        $this->assertDatabaseHas('orders', ['user_id' => $user->id, 'subtotal' => '55.50']);
        $this->assertDatabaseHas('products', ['id' => $productA->id, 'stock' => 8]);
        $this->assertDatabaseHas('products', ['id' => $productB->id, 'stock' => 4]);
        $this->assertDatabaseCount('cart_items', 0);

        $orderNumber = $response->json('order_number');
        $this->assertMatchesRegularExpression('/^NIV-\d{8}-\d{4}$/', $orderNumber);
    }

    public function test_checkout_rejects_and_rolls_back_when_stock_is_insufficient(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 2]);
        $this->actingAs($user)->postJson('/api/cart/items', ['product_id' => $product->id, 'quantity' => 2]);

        // Force the cart line above the now-current stock to simulate a
        // race where stock dropped after the item was added.
        $product->update(['stock' => 1]);

        $response = $this->actingAs($user)->postJson('/api/checkout', $this->shipping);

        $response->assertUnprocessable();
        $this->assertDatabaseCount('orders', 0);
        $this->assertDatabaseHas('products', ['id' => $product->id, 'stock' => 1]);
        $this->assertDatabaseCount('cart_items', 1);
    }

    public function test_an_order_can_be_retrieved_by_its_owner(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 5]);
        $this->actingAs($user)->postJson('/api/cart/items', ['product_id' => $product->id, 'quantity' => 1]);
        $order = $this->actingAs($user)->postJson('/api/checkout', $this->shipping);
        $orderNumber = $order->json('order_number');

        $this->actingAs($user)
            ->getJson("/api/orders/{$orderNumber}")
            ->assertOk()
            ->assertJsonPath('order_number', $orderNumber);
    }

    public function test_a_user_cannot_view_another_users_order(): void
    {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();
        $product = Product::factory()->create(['stock' => 5]);
        $this->actingAs($owner)->postJson('/api/cart/items', ['product_id' => $product->id, 'quantity' => 1]);
        $order = $this->actingAs($owner)->postJson('/api/checkout', $this->shipping);
        $orderNumber = $order->json('order_number');

        $this->actingAs($stranger)
            ->getJson("/api/orders/{$orderNumber}")
            ->assertNotFound();
    }
}
