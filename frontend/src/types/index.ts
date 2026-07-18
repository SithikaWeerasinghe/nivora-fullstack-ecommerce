/**
 * Central data contracts for the Nivora frontend.
 *
 * These shapes mirror the responses the Laravel REST API will return
 * (snake_case fields, string decimal prices, Laravel-style pagination),
 * so the mock service layer can be swapped for real API calls without
 * touching components.
 */

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: string;
  stock: number;
  image_url: string | null;
  is_featured: boolean;
  category: Category;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface ProductListResponse {
  data: Product[];
  meta: PaginationMeta;
}

export type UserRole = "customer" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: number;
  items: CartItem[];
}

export type OrderStatus = "confirmed";

export interface OrderItem {
  id: number;
  product_id: number | null;
  product_name: string;
  unit_price: string;
  quantity: number;
  line_total: string;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  status: OrderStatus;
  subtotal: string;
  total_amount: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  items: OrderItem[];
  created_at: string;
}

export interface CheckoutInput {
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/** Laravel-style validation error bag: field name -> list of messages. */
export type ValidationErrors = Record<string, string[]>;

/** The JSON body shape of an API error response. */
export interface ApiErrorBody {
  message: string;
  errors?: ValidationErrors;
}
