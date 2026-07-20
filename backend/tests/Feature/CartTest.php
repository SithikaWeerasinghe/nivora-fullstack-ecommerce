<?php

namespace Tests\Feature;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_cart_requires_authentication(): void
    {
        $this->getJson('/api/cart')->assertUnauthorized();
    }

    public function test_a_new_user_has_an_empty_cart(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/cart')
            ->assertOk()
            ->assertJsonPath('items', [])
            ->assertJsonPath('item_count', 0);
    }

    public function test_adding_a_product_creates_a_cart_item(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10, 'price' => '20.00']);

        $response = $this->actingAs($user)->postJson('/api/cart/items', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response->assertOk()
            ->assertJsonPath('ok', true)
            ->assertJsonPath('added_quantity', 2)
            ->assertJsonPath('cart.items.0.quantity', 2)
            ->assertJsonPath('cart.subtotal', '40.00');
    }

    public function test_adding_the_same_product_twice_merges_quantities(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10]);

        $this->actingAs($user)->postJson('/api/cart/items', ['product_id' => $product->id, 'quantity' => 2]);
        $this->actingAs($user)->postJson('/api/cart/items', ['product_id' => $product->id, 'quantity' => 3]);

        $this->assertDatabaseCount('cart_items', 1);
        $this->assertDatabaseHas('cart_items', ['product_id' => $product->id, 'quantity' => 5]);
    }

    public function test_adding_more_than_available_stock_is_clamped(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 3]);

        $response = $this->actingAs($user)->postJson('/api/cart/items', [
            'product_id' => $product->id,
            'quantity' => 10,
        ]);

        $response->assertOk()
            ->assertJsonPath('ok', false)
            ->assertJsonPath('added_quantity', 3)
            ->assertJsonPath('cart.items.0.quantity', 3);
    }

    public function test_adding_an_out_of_stock_product_is_rejected(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->outOfStock()->create();

        $response = $this->actingAs($user)->postJson('/api/cart/items', [
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $response->assertOk()
            ->assertJsonPath('ok', false)
            ->assertJsonPath('added_quantity', 0)
            ->assertJsonPath('cart.items', []);
    }

    public function test_quantity_must_be_at_least_one(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/cart/items', ['product_id' => $product->id, 'quantity' => 0])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['quantity']);
    }

    public function test_updating_a_cart_item_clamps_to_stock(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 5]);
        $this->actingAs($user)->postJson('/api/cart/items', ['product_id' => $product->id, 'quantity' => 1]);
        $cartItem = CartItem::first();

        $response = $this->actingAs($user)->patchJson("/api/cart/items/{$cartItem->id}", ['quantity' => 20]);

        $response->assertOk()
            ->assertJsonPath('ok', false)
            ->assertJsonPath('cart.items.0.quantity', 5);
    }

    public function test_a_user_can_remove_a_cart_item(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();
        $this->actingAs($user)->postJson('/api/cart/items', ['product_id' => $product->id, 'quantity' => 1]);
        $cartItem = CartItem::first();

        $this->actingAs($user)
            ->deleteJson("/api/cart/items/{$cartItem->id}")
            ->assertOk()
            ->assertJsonPath('items', []);

        $this->assertDatabaseMissing('cart_items', ['id' => $cartItem->id]);
    }

    public function test_a_user_cannot_modify_another_users_cart_item(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $product = Product::factory()->create();
        $this->actingAs($owner)->postJson('/api/cart/items', ['product_id' => $product->id, 'quantity' => 1]);
        $cartItem = CartItem::first();

        $this->actingAs($intruder)
            ->patchJson("/api/cart/items/{$cartItem->id}", ['quantity' => 2])
            ->assertNotFound();

        $this->actingAs($intruder)
            ->deleteJson("/api/cart/items/{$cartItem->id}")
            ->assertNotFound();
    }
}
