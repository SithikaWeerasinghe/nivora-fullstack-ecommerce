<?php

namespace App\Http\Resources;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Cart
 */
class CartResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $items = $this->whenLoaded('items', fn () => $this->items);

        return [
            'id' => $this->id,
            'items' => CartItemResource::collection($this->whenLoaded('items')),
            // Extra, additive fields beyond the frontend's minimal Cart
            // contract — totals are computed client-side there today, but
            // a real API may as well provide the authoritative figures.
            'subtotal' => $items === null ? '0.00' : number_format(
                $items->sum(fn ($item) => $item->product->price * $item->quantity),
                2, '.', '',
            ),
            'item_count' => $items === null ? 0 : $items->sum('quantity'),
        ];
    }
}
