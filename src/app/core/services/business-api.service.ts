import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer, CustomerDraft, DashboardData, Order, OrderDraft, Product, ProductDraft } from '../models/business.models';

@Injectable({ providedIn: 'root' })
export class BusinessApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.baseUrl}/dashboard`);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders`);
  }

  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/orders/${encodeURIComponent(id)}`);
  }

  createOrder(draft: OrderDraft): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders`, draft);
  }

  updateOrder(id: string, draft: OrderDraft): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/orders/${encodeURIComponent(id)}`, draft);
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/orders/${encodeURIComponent(id)}`);
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseUrl}/customers`);
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/customers/${encodeURIComponent(id)}`);
  }

  createCustomer(draft: CustomerDraft): Observable<Customer> {
    return this.http.post<Customer>(`${this.baseUrl}/customers`, draft);
  }

  updateCustomer(id: string, draft: CustomerDraft): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/customers/${encodeURIComponent(id)}`, draft);
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/customers/${encodeURIComponent(id)}`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${encodeURIComponent(id)}`);
  }

  createProduct(draft: ProductDraft): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products`, draft);
  }

  updateProduct(id: string, draft: ProductDraft): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/products/${encodeURIComponent(id)}`, draft);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${encodeURIComponent(id)}`);
  }
}
