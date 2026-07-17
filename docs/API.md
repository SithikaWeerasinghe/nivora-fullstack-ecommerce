# Nivora API Reference

Base URL: `http://localhost:8000/api`

All endpoints return JSON and use conventional HTTP status codes. Authentication
uses Laravel Sanctum personal access tokens, sent as a bearer token:

```
Authorization: Bearer <token>
Accept: application/json
```

> This reference is completed as each endpoint group is implemented. The sections
> below outline the planned surface of the API.

## Conventions

| Status | Meaning |
| --- | --- |
| 200 | Successful read or update |
| 201 | Resource created |
| 401 | Unauthenticated (missing or invalid token) |
| 403 | Authenticated but not authorized |
| 404 | Resource not found |
| 409 | Inventory / state conflict |
| 422 | Validation error |
| 500 | Unexpected server error |

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

_Register, login, current user, and logout — documented during implementation._

## Categories

_List and admin-only write operations — documented during implementation._

## Products

_List (search, filter, paginate), show, and admin-only write operations._

## Cart

_View cart, add item, update quantity, remove item — documented during implementation._

## Checkout & Orders

_Place order and retrieve an order — documented during implementation._
