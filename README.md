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

_Detailed steps are finalised as the backend is implemented. Outline:_

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# configure the Supabase PostgreSQL credentials in .env
php artisan migrate --seed
php artisan serve
```

## Frontend setup (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local
# set NEXT_PUBLIC_API_URL to the Laravel API base URL
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

_Documented once the full stack is wired together._

## Running the tests

_Backend feature tests and frontend verification commands are documented as they
are implemented._

## Demo credentials

_Assessment-only demo accounts (an admin and a customer) are created by the
database seeder. Credentials are documented here once the seeder is finalised and
can be overridden via seeder configuration._

## API documentation

See [`docs/API.md`](docs/API.md).

## Postman collection

Import [`postman/Nivora-Ecommerce.postman_collection.json`](postman/Nivora-Ecommerce.postman_collection.json).

## Design and technical decisions

_Documented as the application is built._

## Assumptions

_Documented as the application is built._

## Known limitations

- No real payment gateway (out of scope by design); checkout produces a confirmed
  order without payment processing.

## Future improvements

_Documented as the application is built._
