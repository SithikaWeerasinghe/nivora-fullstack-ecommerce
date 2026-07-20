<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Checkout\CheckoutRequest;
use App\Http\Resources\OrderResource;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    /**
     * Confirm the cart, re-verify prices/stock under a row lock, create the
     * order + item snapshots, decrement stock, and clear the cart — all in
     * one transaction so a failure anywhere leaves nothing half-applied.
     */
    public function store(CheckoutRequest $request)
    {
        $user = $request->user();
        $cart = Cart::where('user_id', $user->id)->with('items')->first();

        if (! $cart || $cart->items->isEmpty()) {
            abort(422, 'Your cart is empty.');
        }

        $order = DB::transaction(function () use ($request, $user, $cart) {
            $productIds = $cart->items->pluck('product_id');
            $products = Product::whereIn('id', $productIds)->lockForUpdate()->get()->keyBy('id');

            $subtotal = '0.00';
            $lines = [];

            foreach ($cart->items as $item) {
                $product = $products->get($item->product_id);

                if (! $product) {
                    abort(422, 'One of the items in your cart is no longer available. Please review your cart.');
                }

                if ($item->quantity > $product->stock) {
                    $availableWord = $product->stock === 1 ? 'is' : 'are';
                    abort(422, "Only {$product->stock} of {$product->name} {$availableWord} currently in stock. Please adjust your cart.");
                }

                $lineTotal = bcmul((string) $product->price, (string) $item->quantity, 2);
                $subtotal = bcadd($subtotal, $lineTotal, 2);

                $lines[] = [
                    'product' => $product,
                    'quantity' => $item->quantity,
                    'line_total' => $lineTotal,
                ];
            }

            // Sequential per day, matching the frontend's NIV-YYYYMMDD-#### format.
            // Assessment-scope only: under real concurrent load this would need a
            // DB sequence/advisory lock rather than a count-based guess.
            $orderNumber = sprintf(
                'NIV-%s-%04d',
                now()->format('Ymd'),
                Order::whereDate('created_at', now()->toDateString())->count() + 1,
            );

            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => $orderNumber,
                'status' => 'confirmed',
                'subtotal' => $subtotal,
                'total_amount' => $subtotal,
                'shipping_name' => $request->validated('shipping_name'),
                'shipping_phone' => $request->validated('shipping_phone'),
                'shipping_address' => $request->validated('shipping_address'),
            ]);

            foreach ($lines as $line) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $line['product']->id,
                    'product_name' => $line['product']->name,
                    'unit_price' => $line['product']->price,
                    'quantity' => $line['quantity'],
                    'line_total' => $line['line_total'],
                ]);

                $line['product']->decrement('stock', $line['quantity']);
            }

            $cart->items()->delete();

            return $order;
        });

        return (new OrderResource($order->load('items')))->response()->setStatusCode(201);
    }
}
