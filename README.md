💼 Acme Admin — Business Dashboard

A production-style Angular business dashboard built for managing orders, customers, and products.

The application demonstrates a feature-oriented Angular architecture featuring typed API services, reusable UI infrastructure, reactive forms, validation, CRUD workflows, filtering, sorting, pagination, loading/error states, and automated tests.

    ℹ️ Portfolio Project Note: This is a frontend portfolio project. The application uses an HTTP-shaped, in-memory backend so the frontend can demonstrate realistic API interactions without requiring an external server.

✨ Features

• Dashboard Overview: Displays critical business KPIs, a revenue overview chart, and recent orders.
• Order Management: Includes features to view, create, edit, and delete orders, alongside full search, filter, sort, and pagination support.
• Customer Management: Includes features to view, create, edit, and delete customer profiles, alongside full search, filter, sort, and pagination support.
• Product Management: Includes features to view, create, edit, and delete inventory products, alongside full search, filter, sort, and pagination support.
• Robust UI Infrastructure: Outfitted with reactive forms and validation, explicit loading/empty/error states, and a highly responsive layout.
• Architecture Highlights: Utilizes lazy-loaded feature routes, a typed HTTP API boundary, an in-memory mock backend, and automated tests for core behaviors.

🛠️ Tech Stack

• Framework: Angular
• Language: TypeScript
• State & Reactivity: RxJS
• Routing: Angular Router
• Forms: Reactive Forms
• Networking: HttpClient
• Styling: SCSS
• Testing: Jasmine / Karma

📐 Architecture

The application uses a feature-oriented architecture where each business domain owns its components, services, models, and business logic.
text
src/app/
├── core/
│ ├── api/
│ ├── data/
│ ├── models/
│ └── services/
├── dashboard/
├── orders/
├── customers/
├── products/
├── settings/
├── layout/
└── shared/
└── components/
Use code with caution.

📦 Feature Ownership

The directories src/app/orders/, src/app/customers/, and src/app/products/ each encapsulate their respective domain-specific logic:
• Services
• List & Detail views
• Forms
• Filtering and table behavior
• Domain business rules
This separation keeps business logic modular instead of over-relying on a single generic, tightly-coupled entity management layer.

🌐 API Boundary

Feature services communicate through a centralized BusinessApiService and Angular's HttpClient.
text
Feature Component ➔ Domain Service ➔ BusinessApiService ➔ HttpClient ➔ /api ➔ MockApiBackend
Use code with caution.
• Feature services never access mock data directly.
• MockApiBackend provides the /api endpoints in memory and implements realistic HTTP-style CRUD behavior.
• The mock backend can easily be swapped for a live server later by changing the HTTP provider configuration in app.config.ts.

🧩 Shared UI Infrastructure

The src/app/shared/components/ directory contains domain-agnostic components reused across features, including:
• Custom data tables
• Status badges
• Loading, empty, and error layout states
• Form action wrappers

🛣️ Routing Table

| Route                                                             | Purpose              |
| ----------------------------------------------------------------- | -------------------- |
| `/dashboard`                                                      | Business overview    |
| `/orders`                                                         | Order management     |
| `/orders/new`                                                     | Create an order      |
| `/orders/:id`                                                     | View an order        |
| `/orders/:id/edit`                                                | Edit an order        |
| `/customers`                                                      | Customer management  |
| `/customers/new`                                                  | Create a customer    |
| `/customers/:id`                                                  | View a customer      |
| `/customers/:id/edit`                                             | Edit a customer      |
| `/products`                                                       | Product management   |
| `/products/new`                                                   | Create a product     |
| `/products/:id`                                                   | View a product       |
| `/products/:id/edit`                                              | Edit a product       |
| `/settings`                                                       | Application settings |
| 📌 Note: The root path (/) automatically redirects to /dashboard. |

🚀 Getting Started

Prerequisites

• Node.js (LTS version recommended)
• npm

Installation

Clone the repository and install the project dependencies:
bash
npm install
Use code with caution.

Development Server

Run the local development server:
npm start
Use code with caution.

Once compilation finishes, open your browser and navigate to http://localhost:4200/.

Validation & Testing

Run the automated test suite in a single-run execution mode:
npm test -- --watch=false
Use code with caution.

The test suite covers the mock API implementation, domain CRUD services, order list filtering, table interactions, reactive form validations, and dashboard KPI state ranges.

Production Build

Compile the production-ready build assets to the dist/ directory:
bash
npm run build
Use code with caution.

🧠 Mock Backend Behavior

Because this project utilizes an in-memory database provider, data changes persist only for the current application session and will reset back to seeds whenever the browser page is reloaded.
This environment is intentionally implemented to demonstrate:
• Async HTTP request handling
• Dynamic CRUD operations
• Real-time loading, empty, and error feedback loops
• State-driven user interface updates
Note: Production concerns like persistent user databases, true server synchronization, and authentication are outside the scope of this frontend portfolio project.

🎯 Project Goals

This project was built to demonstrate practical, production-grade Angular development skills in a realistic business context rather than serving as a basic code snippet or minimal tutorial guide.

The core focus remains heavily fixed on maintainable architecture scales, clean domain boundaries, decoupled UI components, strictly-typed API communication layers, advanced form handling validation, and fully testable frontend structures.
