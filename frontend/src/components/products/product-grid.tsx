import { ProductCard } from "./product-card";
import type { Product } from "@/types";

export const productGridClasses =
  "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className={productGridClasses}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
