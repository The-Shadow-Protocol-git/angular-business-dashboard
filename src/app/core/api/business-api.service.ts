import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer, CustomerWriteRequest } from '../models/customer.model';
import { DashboardData } from '../models/dashboard.model';
import { Order, OrderWriteRequest } from '../models/order.model';
import { Product, ProductWriteRequest } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class BusinessApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.baseUrl}/dashboard`);
  }

  getOrders(): Observable<Order[]> { return this.http.get<Order[]>(`${this.baseUrl}/orders`); }
  getOrder(id: string): Observable<Order> { return this.http.get<Order>(`${this.baseUrl}/orders/${encodeURIComponent(id)}`); }
  createOrder(request: OrderWriteRequest): Observable<Order> { return this.http.post<Order>(`${this.baseUrl}/orders`, request); }
  updateOrder(id: string, request: OrderWriteRequest): Observable<Order> { return this.http.put<Order>(`${this.baseUrl}/orders/${encodeURIComponent(id)}`, request); }
  deleteOrder(id: string): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/orders/${encodeURIComponent(id)}`); }

  getCustomers(): Observable<Customer[]> { return this.http.get<Customer[]>(`${this.baseUrl}/customers`); }
  getCustomer(id: string): Observable<Customer> { return this.http.get<Customer>(`${this.baseUrl}/customers/${encodeURIComponent(id)}`); }
  createCustomer(request: CustomerWriteRequest): Observable<Customer> { return this.http.post<Customer>(`${this.baseUrl}/customers`, request); }
  updateCustomer(id: string, request: CustomerWriteRequest): Observable<Customer> { return this.http.put<Customer>(`${this.baseUrl}/customers/${encodeURIComponent(id)}`, request); }
  deleteCustomer(id: string): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/customers/${encodeURIComponent(id)}`); }

  getProducts(): Observable<Product[]> { return this.http.get<Product[]>(`${this.baseUrl}/products`); }
  getProduct(id: string): Observable<Product> { return this.http.get<Product>(`${this.baseUrl}/products/${encodeURIComponent(id)}`); }
  createProduct(request: ProductWriteRequest): Observable<Product> { return this.http.post<Product>(`${this.baseUrl}/products`, request); }
  updateProduct(id: string, request: ProductWriteRequest): Observable<Product> { return this.http.put<Product>(`${this.baseUrl}/products/${encodeURIComponent(id)}`, request); }
  deleteProduct(id: string): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/products/${encodeURIComponent(id)}`); }
}
