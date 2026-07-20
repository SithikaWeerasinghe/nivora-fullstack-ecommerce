/**
 * Service layer entry point. Components import only from "@/services" —
 * never from the API implementations directly — so the underlying
 * transport can change without touching any component.
 */

export {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  type ProductQuery,
} from "./api/product-service";

export { getCategories } from "./api/category-service";

export {
  login,
  register,
  getCurrentUser,
  logout,
} from "./api/auth-service";

export {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  type CartMutationResult,
} from "./api/cart-service";

export { checkout } from "./api/checkout-service";

export { getOrderByNumber } from "./api/order-service";
