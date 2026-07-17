# Nivora — Backend API

The Laravel 13 REST API for Nivora. It owns all business logic: authentication,
validation, product and category management, cart rules, checkout, order
creation, inventory updates, and authorization. The database is PostgreSQL,
hosted on Supabase.

This package is one half of the Nivora monorepo. See the
[root README](../README.md) for the full project overview, architecture, and
setup instructions.

## Stack

- Laravel 13 (REST API)
- Laravel Sanctum (token authentication)
- Laravel Eloquent (ORM)
- PostgreSQL on Supabase

## Quick start

```bash
composer install
cp .env.example .env
php artisan key:generate
# set the Supabase PostgreSQL credentials in .env
php artisan migrate --seed
php artisan serve
```

The API is then available at `http://localhost:8000/api`. A health probe is
exposed at `GET /api/health`.

## Tests

```bash
php artisan test
```

Feature tests run against an in-memory SQLite database, so they need no external
services.

## API reference

Endpoint documentation lives in [`../docs/API.md`](../docs/API.md), and an
importable Postman collection is in
[`../postman/`](../postman/Nivora-Ecommerce.postman_collection.json).
