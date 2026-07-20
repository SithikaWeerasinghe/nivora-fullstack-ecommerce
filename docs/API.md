# Nivora API Reference

Base URL: `http://localhost:8000/api`

All endpoints return JSON and use conventional HTTP status codes. Authentication
uses Laravel Sanctum personal access tokens, sent as a bearer token obtained
from `/register` or `/login`:

```
Authorization: Bearer <token>
Accept: application/json
```

Response shapes mirror `frontend/src/types/index.ts` exactly: single resources
are returned unwrapped, and paginated lists use `{ data, meta }`.

## Conventions

| Status | Meaning |
| --- | --- |
| 200 | Successful read or update |
| 201 | Resource created |
| 401 | Unauthenticated (missing, invalid, or expired token) |
| 403 | Authenticated but not authorized (e.g. non-admin write) |
| 404 | Resource not found, or not owned by the authenticated user |
| 422 | Validation error, or a business rule failure (empty cart, insufficient stock) |
| 500 | Unexpected server error |

Validation failures (`422`) include a field-level error bag:

```json
{
  "message": "The email field is required. (and 1 more error)",
  "errors": { "email": ["The email field is required."] }
}
```

Other failures return `{ "message": "..." }` with no `errors` key.

## Health

### GET /api/health

Liveness probe for the API. No authentication required.

**Response `200 OK`**

```json
{
  "status": "ok",
  "service": "Nivora API",
  "timestamp": "2026-01-01T00:00:00+00:00"
}
```

## Authentication

| Method | Path | Auth | Body |
| --- | --- | --- | --- |
| POST | `/register` | — | `name, email, password, password_confirmation` |
| POST | `/login` | — | `email, password` |
| GET | `/user` | Bearer | — |
| POST | `/logout` | Bearer | — |

`/register` (`201`) and `/login` (`200`) both return:

```json
{ "user": { "id": 1, "name": "Jane Doe", "email": "jane@example.com", "role": "customer" }, "token": "1|abc..." }
```

`user.role` is `"admin"` or `"customer"`. `/logout` revokes the token used for
the request and returns `{ "message": "Logged out." }`.

## Categories

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/categories` | — | Array of categories, no pagination |
| POST | `/categories` | Bearer + admin | `name, slug, description?` |
| PATCH | `/categories/{category}` | Bearer + admin | Partial update |
| DELETE | `/categories/{category}` | Bearer + admin | |

## Products

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/products` | — | Query: `search`, `category` (slug), `featured` (`true`/`false`), `page`, `per_page` (default 12, max 100) |
| GET | `/products/{slug}` | — | 404 if not found |
| POST | `/products` | Bearer + admin | `category_id, name, slug, short_description, description, price, stock, image_url?, is_featured?` |
| PATCH | `/products/{product}` | Bearer + admin | Partial update, `{product}` is the numeric id |
| DELETE | `/products/{product}` | Bearer + admin | |

`GET /products` returns:

```json
{ "data": [ { "...": "Product" } ], "meta": { "current_page": 1, "last_page": 2, "per_page": 12, "total": 20, "from": 1, "to": 12 } }
```

## Cart

All cart endpoints require a Bearer token and only ever operate on the
authenticated user's own cart (a cart is created transparently on first
access).

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/cart` | `{ id, items: [...], subtotal, item_count }` |
| POST | `/cart/items` | `product_id, quantity (>=1)`. Duplicate products merge quantities. |
| PATCH | `/cart/items/{cartItem}` | `quantity (>=1)` |
| DELETE | `/cart/items/{cartItem}` | Returns the resulting cart |

`POST`/`PATCH` never hard-fail on stock — they return **HTTP 200** with a
soft-fail envelope:

```json
{ "cart": { "...": "Cart" }, "ok": false, "added_quantity": 2, "message": "Only 2 more units of X could be added — stock limit reached." }
```

`ok: true` and `message` are omitted when the full request was applied without
clamping. Out-of-stock products return `ok: false, added_quantity: 0`. Acting
on another user's cart item returns `404`.

## Checkout & Orders

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/checkout` | `shipping_name, shipping_phone, shipping_address`. `422` if the cart is empty or any line no longer has enough stock. |
| GET | `/orders/{orderNumber}` | Only the owning user may view it (`404` otherwise) |

Checkout runs as one DB transaction: it re-reads and row-locks every product,
re-validates stock, creates the order plus item snapshots (`product_name`,
`unit_price`, `line_total` captured at time of purchase), decrements stock,
clears the cart, and rolls back everything on any failure.
`order_number` format: `NIV-YYYYMMDD-####`.

## Demo accounts (seeded)

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@nivora.test` (or `ADMIN_EMAIL`) | `password` (or `ADMIN_PASSWORD`) |
| Customer | `customer@nivora.test` (or `DEMO_EMAIL`) | `password` (or `DEMO_PASSWORD`) |

## CORS

The API allows requests only from `FRONTEND_URL` (default
`http://localhost:3000`) and does not use cookies — the frontend authenticates
purely via the `Authorization` bearer header, so `supports_credentials` is
left off.
