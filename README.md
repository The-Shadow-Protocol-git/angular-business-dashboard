# Acme Admin — Business Dashboard

A standalone Angular business dashboard with feature-owned order, customer, and product workflows. It runs without an external backend and uses an HTTP-shaped in-memory API.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:4200/`. The root path redirects to `/dashboard`.

## Architecture

- `src/app/core/api/` provides the typed `HttpClient` REST boundary.
- `src/app/core/data/` contains realistic fixtures and the in-memory `HttpBackend`.
- `src/app/core/models/` contains separate order, customer, product, and dashboard contracts.
- `src/app/orders/`, `src/app/customers/`, and `src/app/products/` own each domain's service, list, detail, forms, filtering, and business rules.
- `src/app/shared/components/` contains domain-agnostic table and state/form/status UI.
- `src/app/dashboard/` owns KPI, revenue chart, and recent-order components.
- `src/app/layout/` contains the responsive router-aware header and sidebar.
- `src/app/settings/` owns the settings screen.

Feature services use `BusinessApiService` and `HttpClient`; they do not access mock arrays directly. `MockApiBackend` supplies the `/api` routes in memory. Replace its `HttpBackend` provider in `app.config.ts` to connect a real API later.

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

Tests cover the mock API and domain CRUD services, order list filtering/table behavior, order form validation and submission, and dashboard states/KPIs/revenue ranges.

The mock backend is intentionally in-memory: changes last for the current app session and reset on reload. Authentication, persistence, and real server integration are outside this frontend demo.
