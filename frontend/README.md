# Nivora — Frontend

The Next.js (App Router) + TypeScript storefront for Nivora, styled with
Tailwind CSS. It is a presentation layer that communicates only with the Laravel
REST API over HTTP — it never accesses the database directly.

This package is one half of the Nivora monorepo. See the
[root README](../README.md) for the full project overview, architecture, and
setup instructions.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Inter (via `next/font`)

## Quick start

```bash
npm install
cp .env.example .env.local
# set NEXT_PUBLIC_API_URL to the Laravel API base URL
npm run dev
```

The app runs at `http://localhost:3000`.

## Environment

Only public values belong in the frontend environment:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the Laravel API, including `/api` |

## Verification

```bash
npm run lint     # ESLint
npm run build    # type-check + production build
```
