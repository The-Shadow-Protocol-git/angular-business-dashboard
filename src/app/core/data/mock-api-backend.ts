import { HttpBackend, HttpErrorResponse, HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Customer, CustomerWriteRequest } from '../models/customer.model';
import { DashboardData } from '../models/dashboard.model';
import { Order, OrderWriteRequest } from '../models/order.model';
import { Product, ProductWriteRequest } from '../models/product.model';
import { MOCK_CUSTOMERS, MOCK_DASHBOARD, MOCK_ORDERS, MOCK_PRODUCTS } from './mock-data';

@Injectable()
export class MockApiBackend implements HttpBackend {
  private orders = structuredClone(MOCK_ORDERS);
  private customers = structuredClone(MOCK_CUSTOMERS);
  private products = structuredClone(MOCK_PRODUCTS);

  handle(request: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    const [path, id] = request.url.replace(/^\/api\/?/, '').split('/');
    if (path === 'dashboard' && request.method === 'GET') {
      return this.response(this.dashboardData());
    }
    if (path !== 'orders' && path !== 'customers' && path !== 'products') {
      return throwError(() => new Error(`Mock API endpoint not found: ${request.url}`));
    }
    return this.handleEntity(path, id, request);
  }

  private handleEntity(path: 'orders' | 'customers' | 'products', id: string | undefined, request: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    if (path === 'orders') {
      if (request.method === 'GET') return id ? this.findById(this.orders, id) : this.response(this.orders);
      if (request.method === 'POST') {
        const draft = request.body as OrderWriteRequest;
        const customer = this.customers.find((item) => item.id === draft.customerId);
        if (!customer) return throwError(() => new Error('Select a valid customer.'));
        const created: Order = { ...draft, id: this.nextId('ORD', this.orders), createdAt: new Date().toISOString(), customer: { id: customer.id, name: customer.name, email: customer.email } };
        this.orders = [created, ...this.orders];
        return this.response(created, 201);
      }
      if (id && request.method === 'PUT') {
        const index = this.orders.findIndex((item) => item.id === id);
        if (index < 0) return this.notFound('Order', id);
        const draft = request.body as OrderWriteRequest;
        const customer = this.customers.find((item) => item.id === draft.customerId);
        if (!customer) return throwError(() => new Error('Select a valid customer.'));
        this.orders[index] = { ...this.orders[index], ...draft, customer: { id: customer.id, name: customer.name, email: customer.email } };
        return this.response(this.orders[index]);
      }
      if (id && request.method === 'DELETE') {
        if (!this.orders.some((item) => item.id === id)) return this.notFound('Order', id);
        this.orders = this.orders.filter((item) => item.id !== id);
        return this.response(null, 204);
      }
    }
    if (path === 'customers') {
      if (request.method === 'GET') return id ? this.findById(this.customers, id) : this.response(this.customers);
      if (request.method === 'POST') {
        const created: Customer = { ...(request.body as CustomerWriteRequest), id: this.nextId('CUS', this.customers), createdAt: new Date().toISOString() };
        this.customers = [created, ...this.customers];
        return this.response(created, 201);
      }
      if (id && request.method === 'PUT') {
        const index = this.customers.findIndex((item) => item.id === id);
        if (index < 0) return this.notFound('Customer', id);
        this.customers[index] = { ...this.customers[index], ...(request.body as CustomerWriteRequest) };
        return this.response(this.customers[index]);
      }
      if (id && request.method === 'DELETE') {
        if (!this.customers.some((item) => item.id === id)) return this.notFound('Customer', id);
        this.customers = this.customers.filter((item) => item.id !== id);
        return this.response(null, 204);
      }
    }
    if (path === 'products') {
      if (request.method === 'GET') return id ? this.findById(this.products, id) : this.response(this.products);
      if (request.method === 'POST') {
        const created: Product = { ...(request.body as ProductWriteRequest), id: this.nextId('PRD', this.products) };
        this.products = [created, ...this.products];
        return this.response(created, 201);
      }
      if (id && request.method === 'PUT') {
        const index = this.products.findIndex((item) => item.id === id);
        if (index < 0) return this.notFound('Product', id);
        this.products[index] = { ...this.products[index], ...(request.body as ProductWriteRequest) };
        return this.response(this.products[index]);
      }
      if (id && request.method === 'DELETE') {
        if (!this.products.some((item) => item.id === id)) return this.notFound('Product', id);
        this.products = this.products.filter((item) => item.id !== id);
        return this.response(null, 204);
      }
    }
    return throwError(() => new Error(`Unsupported mock API request: ${request.method} ${request.url}`));
  }

  private response<T>(body: T, status = 200): Observable<HttpEvent<unknown>> {
    return of(new HttpResponse({ body, status }));
  }

  private findById<T extends { id: string }>(items: readonly T[], id: string): Observable<HttpEvent<unknown>> {
    const item = items.find((entry) => entry.id === id);
    return item ? this.response(item) : this.notFound('Record', id);
  }

  private notFound(resource: string, id: string): Observable<HttpEvent<unknown>> {
    return throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found', error: `${resource} ${id} was not found.` }));
  }

  private nextId(prefix: string, items: readonly { id: string }[]): string {
    const highest = items.reduce((max, item) => Math.max(max, Number(item.id.split('-')[1]) || 0), 0);
    return `${prefix}-${highest + 1}`;
  }

  private dashboardData(): DashboardData {
    const initialRevenue = MOCK_ORDERS.filter((order) => order.status !== 'cancelled').reduce((sum, order) => sum + order.total, 0);
    const currentRevenue = this.orders.filter((order) => order.status !== 'cancelled').reduce((sum, order) => sum + order.total, 0);
    return {
      ...MOCK_DASHBOARD,
      stats: {
        ...MOCK_DASHBOARD.stats,
        revenue: MOCK_DASHBOARD.stats.revenue + currentRevenue - initialRevenue,
        orders: MOCK_DASHBOARD.stats.orders + this.orders.length - MOCK_ORDERS.length,
        customers: MOCK_DASHBOARD.stats.customers + this.customers.length - MOCK_CUSTOMERS.length,
      },
      recentOrders: this.orders.slice(0, 4),
    };
  }
}
