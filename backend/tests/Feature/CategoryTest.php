<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_anyone_can_list_categories(): void
    {
        Category::factory()->count(3)->create();

        $this->getJson('/api/categories')
            ->assertOk()
            ->assertJsonCount(3);
    }

    public function test_guests_cannot_create_categories(): void
    {
        $this->postJson('/api/categories', ['name' => 'Audio', 'slug' => 'audio'])
            ->assertUnauthorized();
    }

    public function test_non_admin_users_cannot_create_categories(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/categories', ['name' => 'Audio', 'slug' => 'audio'])
            ->assertForbidden();
    }

    public function test_admin_can_create_a_category(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->postJson('/api/categories', [
            'name' => 'Audio',
            'slug' => 'audio',
            'description' => 'Sound gear.',
        ]);

        $response->assertCreated()->assertJsonPath('slug', 'audio');
        $this->assertDatabaseHas('categories', ['slug' => 'audio']);
    }

    public function test_admin_can_update_a_category(): void
    {
        $admin = User::factory()->admin()->create();
        $category = Category::factory()->create(['name' => 'Old Name']);

        $this->actingAs($admin)
            ->patchJson("/api/categories/{$category->id}", ['name' => 'New Name'])
            ->assertOk()
            ->assertJsonPath('name', 'New Name');
    }

    public function test_admin_can_delete_a_category(): void
    {
        $admin = User::factory()->admin()->create();
        $category = Category::factory()->create();

        $this->actingAs($admin)
            ->deleteJson("/api/categories/{$category->id}")
            ->assertOk();

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_category_slug_must_be_unique(): void
    {
        $admin = User::factory()->admin()->create();
        Category::factory()->create(['slug' => 'audio']);

        $this->actingAs($admin)
            ->postJson('/api/categories', ['name' => 'Audio Two', 'slug' => 'audio'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);
    }
}
