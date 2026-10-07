import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard-page').then((module) => module.DashboardPage) },
  { path: 'orders', loadComponent: () => import('./orders/order-list/order-list').then((module) => module.OrderList) },
  { path: 'orders/new', loadComponent: () => import('./orders/order-form/order-form').then((module) => module.OrderForm) },
  { path: 'orders/:id/edit', loadComponent: () => import('./orders/order-form/order-form').then((module) => module.OrderForm) },
  { path: 'orders/:id', loadComponent: () => import('./orders/order-detail/order-detail').then((module) => module.OrderDetail) },
  { path: 'customers', loadComponent: () => import('./customers/customer-list/customer-list').then((module) => module.CustomerList) },
  { path: 'customers/new', loadComponent: () => import('./customers/customer-form/customer-form').then((module) => module.CustomerForm) },
  { path: 'customers/:id/edit', loadComponent: () => import('./customers/customer-form/customer-form').then((module) => module.CustomerForm) },
  { path: 'customers/:id', loadComponent: () => import('./customers/customer-detail/customer-detail').then((module) => module.CustomerDetail) },
  { path: 'products', loadComponent: () => import('./products/product-list/product-list').then((module) => module.ProductList) },
  { path: 'products/new', loadComponent: () => import('./products/product-form/product-form').then((module) => module.ProductForm) },
  { path: 'products/:id/edit', loadComponent: () => import('./products/product-form/product-form').then((module) => module.ProductForm) },
  { path: 'products/:id', loadComponent: () => import('./products/product-detail/product-detail').then((module) => module.ProductDetail) },
  { path: 'settings', loadComponent: () => import('./settings/settings-page').then((module) => module.SettingsPage) },
  { path: '**', redirectTo: 'dashboard' },
];
