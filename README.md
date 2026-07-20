# Nivora

**Thoughtful tech for everyday life.**

Nivora is a full-stack e-commerce shopping-cart application for a curated
everyday-technology and lifestyle-accessories store. It is built as a decoupled
system: a **Next.js** storefront talking over HTTP to a **Laravel 13** REST API,
backed by **PostgreSQL** hosted on **Supabase**.

> Built as the Full Stack Developer Intern assessment for Arctiq Solutions.

---

## Table of contents

- [Overview](#overview)
- [Main features](#main-features)
- [Screenshots](#screenshots)
- [Technology stack](#technology-stack)
- [Architecture](#architecture)
- [Repository structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Backend setup (Laravel)](#backend-setup-laravel)
- [Frontend setup (Next.js)](#frontend-setup-nextjs)
- [PostgreSQL / Supabase connection](#postgresql--supabase-connection)
- [Environment variables](#environment-variables)
- [Running the project](#running-the-project)
- [Running the tests](#running-the-tests)
- [Demo credentials](#demo-credentials)
- [API documentation](#api-documentation)
- [Postman collection](#postman-collection)
- [Design and technical decisions](#design-and-technical-decisions)
- [Assumptions](#assumptions)
- [Known limitations](#known-limitations)
- [Future improvements](#future-improvements)

---

## Project status

The full stack is implemented and integrated. The Next.js frontend (home,
product listing with search/filter/pagination, product details, register/login,
cart, protected checkout, order confirmation, custom 404 page) talks over HTTP
to the real Laravel 13 REST API, backed by PostgreSQL on Supabase — there is no
mock data or mock service layer left in the frontend.

`frontend/src/services/` is a thin API client (`frontend/src/lib/api-client.ts`)
that attaches the Sanctum bearer token to protected requests, surfaces 401s
(clearing the stored token) and 422 validation errors, and normalises the
stock-limit soft-fail messages the cart endpoints return.

## Overview

Nivora lets a shopper browse a small, curated catalogue of technology and
lifestyle accessories, search and filter products, view product details, create
an account, build a cart, and complete a simple, trustworthy checkout that
produces a real, server-generated order.

The architecture is intentionally decoupled and server-authoritative: the Laravel
API owns all business logic — authentication, validation, cart rules, pricing,
stock, and order creation — while the Next.js frontend is a presentation layer
that talks only to that API. Supabase is used **solely** as the managed
PostgreSQL host; there is no Supabase Auth, no Supabase client queries from the
browser, and no direct database access from the frontend.

## Main features

- Product catalogue with search, category filtering, and server-backed pagination
- Product detail pages with stock-aware quantity selection
- Token-based authentication (register / login / logout) with Laravel Sanctum
- Server-authoritative cart with quantity-merge and stock caps
- Transactional checkout with stock re-validation and inventory updates
- Order confirmation rendered from backend order data
- Accessible, mobile-first, responsive UI
- Consistent JSON API with clear HTTP status codes

## Screenshots

_Screenshots will be added in [`docs/screenshots/`](docs/screenshots/)._

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Backend | Laravel 13 (REST API) |
| ORM | Laravel Eloquent |
| Authentication | Laravel Sanctum (API tokens) |
| Database | PostgreSQL (hosted on Supabase) |
| Testing | PHPUnit feature tests (backend), ESLint + `tsc` + `next build` (frontend) |

## Architecture

```
Next.js frontend  ──HTTP REST──▶  Laravel 13 API  ──▶  Supabase-hosted PostgreSQL
```

- The frontend never touches the database directly.
- Supabase is a PostgreSQL host only.
- All authentication, validation, product/cart/checkout/order logic, inventory
  updates, and authorization live in Laravel.

## Repository structure

```
nivora-fullstack-ecommerce/
├── frontend/        # Next.js + TypeScript + Tailwind storefront
├── backend/         # Laravel 13 REST API + Sanctum + Eloquent
├── docs/
│   ├── API.md       # Endpoint-by-endpoint API reference
│   └── screenshots/ # UI screenshots
├── postman/
│   └── Nivora-Ecommerce.postman_collection.json
├── README.md
└── .gitignore
```

## Prerequisites

- PHP 8.3+ with the `pdo_pgsql` extension
- Composer 2.x
- Node.js 20+ and npm
- A Supabase project (for the hosted PostgreSQL database)

## Backend setup (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# configure the Supabase PostgreSQL credentials in .env (DB_HOST is the
# bare hostname only — do not paste a full postgresql:// connection string)
php artisan migrate:fresh --seed
php artisan serve
```

## Frontend setup (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local
# NEXT_PUBLIC_API_URL defaults to http://localhost:8000/api
npm run dev
```

## PostgreSQL / Supabase connection

Supabase provides the managed PostgreSQL instance. The Laravel backend connects
to it through standard PostgreSQL environment variables (host, port, database,
username, password). Connection details are documented in
[Environment variables](#environment-variables) and in `backend/.env.example`.

## Environment variables

- **Backend** (`backend/.env`): PostgreSQL connection, app key, Sanctum settings.
  See `backend/.env.example`.
- **Frontend** (`frontend/.env.local`): only the public API base URL
  (`NEXT_PUBLIC_API_URL`). No database credentials or secrets are ever exposed to
  the frontend. See `frontend/.env.example`.

## Running the project

Run both dev servers side by side:

```bash
# Terminal 1
cd backend && php artisan serve

# Terminal 2
cd frontend && npm run dev
```

Then visit `http://localhost:3000`. The backend must be reachable at
`NEXT_PUBLIC_API_URL` (default `http://localhost:8000/api`) — public pages
(home, product listing/detail) fetch categories and products server-side, so
the API needs to be up before the frontend is loaded.

## Running the tests

```bash
# Backend
cd backend
php artisan test
./vendor/bin/pint --test

# Frontend
cd frontend
npx tsc --noEmit
npm run lint
npm run build
```

## Demo credentials

Assessment-only accounts, created by `UserSeeder` (override via the `ADMIN_*` /
`DEMO_*` env vars):

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@nivora.test` | `password` |
| Customer | `customer@nivora.test` | `password` |

## API documentation

See [`docs/API.md`](docs/API.md).

## Postman collection

Import [`postman/Nivora-Ecommerce.postman_collection.json`](postman/Nivora-Ecommerce.postman_collection.json).

## Design and technical decisions

- **Bearer tokens, not cookies.** Sanctum issues a personal access token on
  register/login; the frontend stores it (via a small guarded localStorage
  wrapper, never accessed directly by components) and sends
  `Authorization: Bearer <token>` on protected requests. CORS therefore runs
  with `supports_credentials: false` and no CSRF/cookie dance is needed.
- **Server-authoritative cart and checkout.** The cart lives entirely in
  Postgres, keyed to the authenticated user — there is no guest/local cart.
  Add/update requests never hard-fail on stock: they return `200` with an
  `{ ok, message }` envelope so the UI can show a clamped result instead of an
  error. Checkout re-validates prices and stock under a row lock inside one
  DB transaction, so the client's cart totals are never trusted.
- **Single API client seam.** Every request goes through
  `frontend/src/lib/api-client.ts`, which attaches the token, and turns `401`
  (clearing the stored token) and `422` (field errors) into a single
  `ApiRequestError` shape the rest of the frontend already knew how to render.

## Assumptions

- A logged-out visitor can browse and search the catalogue but must register
  or log in before adding anything to a cart (the backend has no concept of a
  guest cart).
- The demo/admin accounts and their passwords are for local assessment only
  and are not meant to be reused in a real deployment.

## Known limitations

- No real payment gateway (out of scope by design); checkout produces a confirmed
  order without payment processing.
- No guest cart: cart state is per authenticated user only, so switching
  accounts (or logging out) does not preserve an in-progress cart.
- Order numbering is a per-day count guard (`NIV-YYYYMMDD-####`), not a DB
  sequence/advisory lock — fine for assessment-scale traffic, not for real
  concurrent load.

## Future improvements

- Persist a guest cart (e.g. by session) and merge it into the user's cart on login.
- Add a real payment provider integration ahead of the confirmed-order step.
- Replace the per-day count-based order number with a DB sequence for safe
  concurrency.
