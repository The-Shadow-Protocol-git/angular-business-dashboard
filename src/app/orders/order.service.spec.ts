import { HttpBackend, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { MockApiBackend } from '../core/data/mock-api-backend';
import { OrderWriteRequest } from '../core/models/order.model';
import { DashboardService } from '../core/services/dashboard.service';
import { OrderService } from './order.service';

describe('OrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), { provide: HttpBackend, useClass: MockApiBackend }],
    });
  });

  it('gets orders and a single order', async () => {
    const service = TestBed.inject(OrderService);
    const orders = await firstValueFrom(service.getOrders());
    const order = await firstValueFrom(service.getOrder(orders[0].id));

    expect(orders.length).toBeGreaterThan(0);
    expect(order.customer.name).toBeTruthy();
    expect(order.items.length).toBeGreaterThan(0);
  });

  it('creates, updates, cancels, and deletes an order', async () => {
    const service = TestBed.inject(OrderService);
    const request: OrderWriteRequest = {
      customerId: 'CUS-2048',
      total: 129,
      status: 'pending',
      items: [{ productId: 'PRD-3201', productName: 'Wireless Headphones', quantity: 1, unitPrice: 129 }],
    };

    const beforeCreate = await firstValueFrom(TestBed.inject(DashboardService).load());
    const created = await firstValueFrom(service.createOrder(request));
    expect(created.customer.name).toBe('Olivia Rhye');
    const afterCreate = await firstValueFrom(TestBed.inject(DashboardService).load());
    expect(afterCreate.stats.orders).toBe(beforeCreate.stats.orders + 1);
    expect(afterCreate.stats.revenue).toBe(beforeCreate.stats.revenue + request.total);
    expect(afterCreate.recentOrders[0].id).toBe(created.id);

    const update: OrderWriteRequest = { ...request, total: 258, items: [{ ...request.items[0], quantity: 2 }] };
    const updated = await firstValueFrom(service.updateOrder(created.id, update));
    expect(updated.total).toBe(258);

    const cancelled = await firstValueFrom(service.cancelOrder(created.id));
    expect(cancelled.status).toBe('cancelled');
    expect(cancelled.items).toEqual(update.items);
    await expect(firstValueFrom(service.cancelOrder('ORD-1024'))).rejects.toThrow('cannot be cancelled');

    await firstValueFrom(service.deleteOrder(created.id));
    const remaining = await firstValueFrom(service.getOrders());
    expect(remaining.some((order) => order.id === created.id)).toBe(false);
  });
});
