import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, throwError } from 'rxjs';
import { BusinessApiService } from '../core/api/business-api.service';
import { Order, OrderStatus, OrderWriteRequest } from '../core/models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly api = inject(BusinessApiService);

  getOrders(): Observable<Order[]> { return this.api.getOrders(); }
  getOrder(id: string): Observable<Order> { return this.api.getOrder(id); }
  createOrder(request: OrderWriteRequest): Observable<Order> { return this.api.createOrder(request); }
  updateOrder(id: string, request: OrderWriteRequest): Observable<Order> { return this.api.updateOrder(id, request); }
  deleteOrder(id: string): Observable<void> { return this.api.deleteOrder(id); }

  cancelOrder(id: string): Observable<Order> {
    return this.getOrder(id).pipe(
      switchMap((order) => order.status === 'pending' || order.status === 'processing'
        ? this.updateOrder(id, this.toRequest(order, 'cancelled'))
        : throwError(() => new Error(`Order ${id} cannot be cancelled from status "${order.status}".`))),
    );
  }

  private toRequest(order: Order, status: OrderStatus): OrderWriteRequest {
    return {
      customerId: order.customer.id,
      total: order.total,
      status,
      items: order.items,
    };
  }
}
