/**
 * Service layer entry point — the swap seam between the mock phase and
 * the Laravel REST API. Components import only from "@/services"; when
 * the backend is integrated, these re-exports switch to the real API
 * implementations without any component changes.
 */

export {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  type ProductQuery,
} from "./mock/product-service";

export { getCategories } from "./mock/category-service";

export {
  login,
  register,
  getCurrentUser,
  logout,
} from "./mock/auth-service";

export {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  type CartMutationResult,
} from "./mock/cart-service";

export { checkout } from "./mock/checkout-service";

export { getOrderByNumber } from "./mock/order-service";
