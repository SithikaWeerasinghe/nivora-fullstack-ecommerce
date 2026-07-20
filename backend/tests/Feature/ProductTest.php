<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_product_list_is_paginated(): void
    {
        Product::factory()->count(15)->create();

        $response = $this->getJson('/api/products?per_page=10');

        $response->assertOk()
            ->assertJsonCount(10, 'data')
            ->assertJsonPath('meta.total', 15)
            ->assertJsonPath('meta.last_page', 2);
    }

    public function test_products_can_be_searched_by_name(): void
    {
        Product::factory()->create(['name' => 'Aurora Wireless Headphones']);
        Product::factory()->create(['name' => 'Completely Different Item']);

        $this->getJson('/api/products?search=aurora')
            ->assertOk()
            ->assertJsonPath('meta.total', 1);
    }

    public function test_products_can_be_filtered_by_category_slug(): void
    {
        $audio = Category::factory()->create(['slug' => 'audio']);
        $workspace = Category::factory()->create(['slug' => 'workspace']);
        Product::factory()->count(2)->create(['category_id' => $audio->id]);
        Product::factory()->create(['category_id' => $workspace->id]);

        $this->getJson('/api/products?category=audio')
            ->assertOk()
            ->assertJsonPath('meta.total', 2);
    }

    public function test_products_can_be_filtered_by_featured(): void
    {
        Product::factory()->count(2)->featured()->create();
        Product::factory()->count(3)->create();

        $this->getJson('/api/products?featured=true')
            ->assertOk()
            ->assertJsonPath('meta.total', 2);
    }

    public function test_a_single_product_can_be_fetched_by_slug(): void
    {
        $product = Product::factory()->create(['slug' => 'aurora-wireless-headphones']);

        $this->getJson('/api/products/aurora-wireless-headphones')
            ->assertOk()
            ->assertJsonPath('id', $product->id)
            ->assertJsonPath('price', (string) $product->price)
            ->assertJsonPath('category.id', $product->category_id);
    }

    public function test_an_unknown_slug_returns_404(): void
    {
        $this->getJson('/api/products/does-not-exist')->assertNotFound();
    }

    public function test_non_admin_users_cannot_create_products(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        $this->actingAs($user)->postJson('/api/products', [
            'category_id' => $category->id,
            'name' => 'New Product',
            'slug' => 'new-product',
            'short_description' => 'Short.',
            'description' => 'Long.',
            'price' => '19.99',
            'stock' => 10,
        ])->assertForbidden();
    }

    public function test_admin_can_create_update_and_delete_a_product(): void
    {
        $admin = User::factory()->admin()->create();
        $category = Category::factory()->create();

        $create = $this->actingAs($admin)->postJson('/api/products', [
            'category_id' => $category->id,
            'name' => 'New Product',
            'slug' => 'new-product',
            'short_description' => 'Short.',
            'description' => 'Long.',
            'price' => '19.99',
            'stock' => 10,
        ]);
        $create->assertCreated()->assertJsonPath('slug', 'new-product');
        $productId = $create->json('id');

        $this->actingAs($admin)
            ->patchJson("/api/products/{$productId}", ['stock' => 5])
            ->assertOk()
            ->assertJsonPath('stock', 5);

        $this->actingAs($admin)
            ->deleteJson("/api/products/{$productId}")
            ->assertOk();

        $this->assertDatabaseMissing('products', ['id' => $productId]);
    }
}
