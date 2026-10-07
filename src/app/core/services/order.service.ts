import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderDraft } from '../models/business.models';
import { BusinessApiService } from './business-api.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly api = inject(BusinessApiService);

  list(): Observable<Order[]> { return this.api.getOrders(); }
  get(id: string): Observable<Order> { return this.api.getOrder(id); }
  create(draft: OrderDraft): Observable<Order> { return this.api.createOrder(draft); }
  update(id: string, draft: OrderDraft): Observable<Order> { return this.api.updateOrder(id, draft); }
  remove(id: string): Observable<void> { return this.api.deleteOrder(id); }
}
