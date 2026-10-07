# Acme Admin — Business Dashboard

A production-style Angular business dashboard for managing orders, customers, and products.

The application demonstrates a feature-oriented Angular architecture with typed API services, reusable UI infrastructure, reactive forms, validation, CRUD workflows, filtering, sorting, pagination, loading/error states, and automated tests.

> **Note:** This is a frontend portfolio project. The application uses an HTTP-shaped in-memory backend so the frontend can demonstrate realistic API interactions without requiring an external server.

## Features

- Dashboard with business KPIs, revenue overview, and recent orders
- Order management
  - View orders
  - Create and edit orders
  - Delete orders
  - Search, filter, sort, and paginate
- Customer management
  - View customers
  - Create and edit customers
  - Delete customers
  - Search, filter, sort, and paginate
- Product management
  - View products
  - Create and edit products
  - Delete products
  - Search, filter, sort, and paginate
- Reactive forms with validation
- Loading, empty, and error states
- Reusable data table and UI state components
- Responsive layout
- Lazy-loaded feature routes
- Typed HTTP API boundary
- In-memory mock backend
- Automated tests for core application behavior

## Tech Stack

- Angular
- TypeScript
- RxJS
- Angular Router
- Reactive Forms
- HttpClient
- SCSS
- Jasmine / Karma

## Architecture

The application uses a feature-oriented architecture where each business domain owns its components, service, models, and business logic.

```text
src/app/
├── core/
│   ├── api/
│   ├── data/
│   ├── models/
│   └── services/
│
├── dashboard/
├── orders/
├── customers/
├── products/
├── settings/
├── layout/
└── shared/
    └── components/
```
