<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddCartItemRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Cart mutations return HTTP 200 with an {cart, ok, message} envelope for
 * stock-limited outcomes rather than a 4xx error — the same soft-fail
 * contract the frontend's mock cart service already models, so the UI can
 * show a clamped cart plus an explanatory message instead of a hard
 * failure. Only genuinely invalid requests (bad input, wrong owner) 4xx.
 */
class CartItemController extends Controller
{
    public function store(AddCartItemRequest $request)
    {
        $user = $request->user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        return DB::transaction(function () use ($request, $cart) {
            $product = Product::lockForUpdate()->findOrFail($request->validated('product_id'));

            if ($product->stock <= 0) {
                return $this->mutationResponse($cart, false, "{$product->name} is out of stock.", 0);
            }

            $existing = CartItem::where('cart_id', $cart->id)->where('product_id', $product->id)->first();
            $currentQuantity = $existing?->quantity ?? 0;
            $room = $product->stock - $currentQuantity;

            if ($room <= 0) {
                return $this->mutationResponse(
                    $cart, false,
                    "Your cart already has the maximum available quantity of {$product->name}.",
                    0,
                );
            }

            $requested = (int) $request->validated('quantity');
            $added = min($requested, $room);

            if ($existing) {
                $existing->increment('quantity', $added);
            } else {
                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'quantity' => $added,
                ]);
            }

            $ok = $added === $requested;
            $unitWord = $added === 1 ? 'unit' : 'units';
            $message = $ok ? null : "Only {$added} more {$unitWord} of {$product->name} could be added — stock limit reached.";

            return $this->mutationResponse($cart, $ok, $message, $added);
        });
    }

    public function update(UpdateCartItemRequest $request, CartItem $cartItem)
    {
        $this->ensureOwnedByUser($request->user(), $cartItem);

        return DB::transaction(function () use ($request, $cartItem) {
            $product = Product::lockForUpdate()->findOrFail($cartItem->product_id);

            $requested = max(1, (int) $request->validated('quantity'));
            $clamped = min($requested, max($product->stock, 1));
            $cartItem->update(['quantity' => $clamped]);

            $ok = $clamped === $requested;
            $availableWord = $product->stock === 1 ? 'is' : 'are';
            $message = $ok ? null : "Only {$product->stock} of {$product->name} {$availableWord} available.";

            return $this->mutationResponse($cartItem->cart, $ok, $message);
        });
    }

    public function destroy(Request $request, CartItem $cartItem)
    {
        $this->ensureOwnedByUser($request->user(), $cartItem);

        $cart = $cartItem->cart;
        $cartItem->delete();

        // See CartController::show() for why this must be forced to 200.
        return (new CartResource($cart->load('items.product.category')))
            ->response()
            ->setStatusCode(200);
    }

    private function ensureOwnedByUser(User $user, CartItem $cartItem): void
    {
        if ($cartItem->cart->user_id !== $user->id) {
            abort(404);
        }
    }

    private function mutationResponse(Cart $cart, bool $ok, ?string $message = null, ?int $addedQuantity = null): JsonResponse
    {
        $payload = [
            'cart' => new CartResource($cart->load('items.product.category')),
            'ok' => $ok,
        ];

        if ($addedQuantity !== null) {
            $payload['added_quantity'] = $addedQuantity;
        }

        if ($message !== null) {
            $payload['message'] = $message;
        }

        return response()->json($payload);
    }
}
