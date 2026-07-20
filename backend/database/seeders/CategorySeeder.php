<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Categories matching frontend/src/data/mock-categories.ts exactly
     * (same ids, names, slugs, descriptions).
     */
    public function run(): void
    {
        $now = now();

        $categories = [
            [
                'id' => 1,
                'name' => 'Audio',
                'slug' => 'audio',
                'description' => 'Headphones, earbuds, and speakers for focused listening.',
            ],
            [
                'id' => 2,
                'name' => 'Workspace',
                'slug' => 'workspace',
                'description' => 'Keyboards, lighting, and desk accessories for productive setups.',
            ],
            [
                'id' => 3,
                'name' => 'Smart Home',
                'slug' => 'smart-home',
                'description' => 'Simple connected devices that make everyday routines easier.',
            ],
            [
                'id' => 4,
                'name' => 'Mobile Accessories',
                'slug' => 'mobile-accessories',
                'description' => 'Chargers, stands, and cables for phones and tablets.',
            ],
            [
                'id' => 5,
                'name' => 'Travel Tech',
                'slug' => 'travel-tech',
                'description' => 'Compact gear that keeps devices organised and powered on the move.',
            ],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->updateOrInsert(
                ['id' => $category['id']],
                $category + ['created_at' => $now, 'updated_at' => $now],
            );
        }

        // Explicit ids don't advance a Postgres SERIAL sequence, so a
        // later Category::create() without an id could collide. Bring the
        // sequence back in sync (no-op on sqlite, used for local dev).
        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("SELECT setval(pg_get_serial_sequence('categories', 'id'), (SELECT MAX(id) FROM categories))");
        }
    }
}
