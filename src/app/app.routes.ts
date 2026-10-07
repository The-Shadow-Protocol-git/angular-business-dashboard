import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard-page').then((module) => module.DashboardPage) },
  { path: 'orders', data: { entity: 'orders' }, loadComponent: () => import('./management/management-list-page').then((module) => module.ManagementListPage) },
  { path: 'orders/new', data: { entity: 'orders' }, loadComponent: () => import('./management/entity-form-page').then((module) => module.EntityFormPage) },
  { path: 'orders/:id/edit', data: { entity: 'orders' }, loadComponent: () => import('./management/entity-form-page').then((module) => module.EntityFormPage) },
  { path: 'orders/:id', data: { entity: 'orders' }, loadComponent: () => import('./management/entity-detail-page').then((module) => module.EntityDetailPage) },
  { path: 'customers', data: { entity: 'customers' }, loadComponent: () => import('./management/management-list-page').then((module) => module.ManagementListPage) },
  { path: 'customers/new', data: { entity: 'customers' }, loadComponent: () => import('./management/entity-form-page').then((module) => module.EntityFormPage) },
  { path: 'customers/:id/edit', data: { entity: 'customers' }, loadComponent: () => import('./management/entity-form-page').then((module) => module.EntityFormPage) },
  { path: 'customers/:id', data: { entity: 'customers' }, loadComponent: () => import('./management/entity-detail-page').then((module) => module.EntityDetailPage) },
  { path: 'products', data: { entity: 'products' }, loadComponent: () => import('./management/management-list-page').then((module) => module.ManagementListPage) },
  { path: 'products/new', data: { entity: 'products' }, loadComponent: () => import('./management/entity-form-page').then((module) => module.EntityFormPage) },
  { path: 'products/:id/edit', data: { entity: 'products' }, loadComponent: () => import('./management/entity-form-page').then((module) => module.EntityFormPage) },
  { path: 'products/:id', data: { entity: 'products' }, loadComponent: () => import('./management/entity-detail-page').then((module) => module.EntityDetailPage) },
  { path: 'settings', loadComponent: () => import('./management/settings-page').then((module) => module.SettingsPage) },
  { path: '**', redirectTo: 'dashboard' },
];
