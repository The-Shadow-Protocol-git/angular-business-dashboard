import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap, throwError } from 'rxjs';
import { Customer, CustomerDraft, EntityType, ManagedRow, Order, OrderDraft, Product, ProductDraft } from '../models/business.models';
import { CustomerService } from './customer.service';
import { OrderService } from './order.service';
import { ProductService } from './product.service';

export interface EntityFormValue {
  name: string;
  email: string;
  phone: string;
  customerId: string;
  productId: string;
  quantity: string;
  total: string;
  status: string;
  sku: string;
  price: string;
  stock: string;
  category: string;
}

export interface DetailField {
  label: string;
  value: string;
}

export interface EntityDetails {
  id: string;
  title: string;
  status: string;
  fields: DetailField[];
}

@Injectable({ providedIn: 'root' })
export class ManagementService {
  private readonly orders = inject(OrderService);
  private readonly customers = inject(CustomerService);
  private readonly products = inject(ProductService);

  list(type: EntityType): Observable<ManagedRow[]> {
    switch (type) {
      case 'orders':
        return this.orders.list().pipe(map((items) => items.map((item) => ({
          id: item.id, primary: item.customer.name, secondary: item.customer.email,
          value: item.total, status: item.status, date: item.createdAt,
        }))));
      case 'customers':
        return this.customers.list().pipe(map((items) => items.map((item) => ({
          id: item.id, primary: item.name, secondary: item.email,
          value: 0, status: item.status, date: item.createdAt,
        }))));
      case 'products':
        return this.products.list().pipe(map((items) => items.map((item) => ({
          id: item.id, primary: item.name, secondary: `${item.sku} · ${item.category}`,
          value: item.price, status: item.stock === 0 ? 'out of stock' : item.status, date: '', inventory: item.stock,
        }))));
    }
  }

  details(type: EntityType, id: string): Observable<EntityDetails> {
    switch (type) {
      case 'orders':
        return this.orders.get(id).pipe(map((item) => this.orderDetails(item)));
      case 'customers':
        return this.customers.get(id).pipe(map((item) => this.customerDetails(item)));
      case 'products':
        return this.products.get(id).pipe(map((item) => this.productDetails(item)));
    }
  }

  formValue(type: EntityType, id: string): Observable<EntityFormValue> {
    const empty = this.emptyValue();
    switch (type) {
      case 'orders':
        return this.orders.get(id).pipe(map((item) => ({
          ...empty, customerId: item.customer.id, productId: item.items[0]?.productId ?? '',
          quantity: String(item.items[0]?.quantity ?? 1), total: String(item.total), status: item.status,
        })));
      case 'customers':
        return this.customers.get(id).pipe(map((item) => ({
          ...empty, name: item.name, email: item.email, phone: item.phone, status: item.status,
        })));
      case 'products':
        return this.products.get(id).pipe(map((item) => ({
          ...empty, name: item.name, sku: item.sku, price: String(item.price), stock: String(item.stock),
          category: item.category, status: item.status,
        })));
    }
  }

  save(type: EntityType, id: string | null, value: EntityFormValue): Observable<unknown> {
    switch (type) {
      case 'orders':
        return this.products.list().pipe(switchMap((products) => {
          const product = products.find((item) => item.id === value.productId);
          if (!product) return throwError(() => new Error('Select a valid product.'));
          const draft: OrderDraft = {
            customerId: value.customerId,
            total: Number(value.total),
            status: value.status as OrderDraft['status'],
            items: [{ productId: product.id, productName: product.name, quantity: Number(value.quantity), unitPrice: product.price }],
          };
          return id ? this.orders.update(id, draft) : this.orders.create(draft);
        }));
      case 'customers': {
        const draft: CustomerDraft = { name: value.name.trim(), email: value.email.trim(), phone: value.phone.trim(), status: value.status as CustomerDraft['status'] };
        return id ? this.customers.update(id, draft) : this.customers.create(draft);
      }
      case 'products': {
        const draft: ProductDraft = { name: value.name.trim(), sku: value.sku.trim(), price: Number(value.price), stock: Number(value.stock), category: value.category.trim(), status: value.status as ProductDraft['status'] };
        return id ? this.products.update(id, draft) : this.products.create(draft);
      }
    }
  }

  remove(type: EntityType, id: string): Observable<void> {
    switch (type) {
      case 'orders': return this.orders.remove(id);
      case 'customers': return this.customers.remove(id);
      case 'products': return this.products.remove(id);
    }
  }

  cancelOrder(id: string): Observable<Order> {
    return this.orders.get(id).pipe(
      switchMap((order) => this.orders.update(id, {
        customerId: order.customer.id,
        total: order.total,
        status: 'cancelled',
      })),
    );
  }

  private emptyValue(): EntityFormValue {
    return { name: '', email: '', phone: '', customerId: '', productId: '', quantity: '1', total: '', status: 'active', sku: '', price: '', stock: '', category: '' };
  }

  private orderDetails(item: Order): EntityDetails {
    return {
      id: item.id, title: item.customer.name, status: item.status,
      fields: [
        { label: 'Customer email', value: item.customer.email },
        { label: 'Order total', value: this.currency(item.total) },
        { label: 'Created', value: this.date(item.createdAt) },
        { label: 'Items', value: item.items.map((line) => `${line.quantity} × ${line.productName}`).join(', ') || 'No items' },
      ],
    };
  }

  private customerDetails(item: Customer): EntityDetails {
    return { id: item.id, title: item.name, status: item.status, fields: [
      { label: 'Email', value: item.email }, { label: 'Phone', value: item.phone || '—' },
      { label: 'Customer since', value: this.date(item.createdAt) },
    ] };
  }

  private productDetails(item: Product): EntityDetails {
    return { id: item.id, title: item.name, status: item.stock === 0 ? 'out of stock' : item.status, fields: [
      { label: 'SKU', value: item.sku }, { label: 'Category', value: item.category },
      { label: 'Price', value: this.currency(item.price) }, { label: 'Stock', value: String(item.stock) },
    ] };
  }

  private currency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  private date(value: string): string {
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value));
  }
}
