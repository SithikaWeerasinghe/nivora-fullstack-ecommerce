<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function show(Request $request)
    {
        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);

        // Force 200: JsonResource otherwise auto-returns 201 the moment
        // firstOrCreate() transparently creates a cart for a first-time
        // visitor, which is wrong for what is semantically a GET/fetch.
        return (new CartResource($cart->load('items.product.category')))
            ->response()
            ->setStatusCode(200);
    }
}
