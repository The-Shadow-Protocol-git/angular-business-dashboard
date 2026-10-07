# Acme Admin — Business Dashboard

A standalone Angular business dashboard with lazy-loaded management screens for orders, customers, and products. It is self-contained and works without an external backend.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:4200/`. The root path redirects to `/dashboard`.

## Architecture

- `src/app/layout/` contains the responsive sidebar and route-aware header.
- `src/app/dashboard/` contains the dashboard page and reusable stat, revenue, and recent-order components.
- `src/app/management/` contains shared entity list, detail, and validated create/edit experiences for all three business domains.
- `src/app/core/models/` defines typed dashboard, order, customer, and product data.
- `src/app/core/services/` contains domain services and the HTTP API boundary.
- `src/app/core/data/` contains realistic sample data and the local `HttpBackend` implementation.

The domain services use `HttpClient` against `/api`. `MockApiBackend` implements the dashboard and CRUD endpoints in memory, so the application can demonstrate loading, error, empty, and mutation flows without claiming a real server exists. Replace the `HttpBackend` provider in `app.config.ts` with the regular browser backend when connecting a real API.

## Routes

- `/dashboard`
- `/orders`, `/orders/new`, `/orders/:id`, `/orders/:id/edit`
- `/customers`, `/customers/new`, `/customers/:id`, `/customers/:id/edit`
- `/products`, `/products/new`, `/products/:id`, `/products/:id/edit`
- `/settings`

## Validate

```bash
npm test -- --watch=false
npm run build
```

The mock backend is intentionally in-memory: changes last for the current app session and reset on reload. Authentication, persistence, and real server integration are outside this frontend demo.
