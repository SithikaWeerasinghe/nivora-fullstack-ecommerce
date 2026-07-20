<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->with('category');

        $search = trim((string) $request->query('search', ''));
        if ($search !== '') {
            $term = '%'.mb_strtolower($search).'%';
            $query->where(function ($inner) use ($term) {
                $inner->whereRaw('LOWER(name) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(short_description) LIKE ?', [$term])
                    ->orWhereHas('category', function ($categoryQuery) use ($term) {
                        $categoryQuery->whereRaw('LOWER(name) LIKE ?', [$term]);
                    });
            });
        }

        if ($category = $request->query('category')) {
            $query->whereHas('category', fn ($categoryQuery) => $categoryQuery->where('slug', $category));
        }

        if ($request->has('featured')) {
            $query->where('is_featured', filter_var($request->query('featured'), FILTER_VALIDATE_BOOLEAN));
        }

        $perPage = max(1, min(100, (int) $request->query('per_page', 12)));

        $products = $query->orderBy('id')->paginate($perPage)->withQueryString();

        return ProductResource::collection($products);
    }

    public function show(string $slug)
    {
        $product = Product::with('category')->where('slug', $slug)->firstOrFail();

        return new ProductResource($product);
    }

    public function store(StoreProductRequest $request)
    {
        $product = Product::create($request->validated())->load('category');

        return (new ProductResource($product))->response()->setStatusCode(201);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->validated());

        return new ProductResource($product->load('category'));
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Product deleted.']);
    }
}
