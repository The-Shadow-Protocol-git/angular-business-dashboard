import { HttpBackend, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { MockApiBackend } from '../data/mock-api-backend';
import { OrderService } from './order.service';
import { DashboardService } from './dashboard.service';

describe('Business API services', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), { provide: HttpBackend, useClass: MockApiBackend }],
    });
  });

  it('serves dashboard data through the HTTP abstraction', async () => {
    const dashboard = await firstValueFrom(TestBed.inject(DashboardService).load());

    expect(dashboard.stats.revenue).toBeGreaterThan(0);
    expect(dashboard.revenue['6m']).toHaveLength(6);
    expect(dashboard.recentOrders.length).toBeGreaterThan(0);
  });

  it('creates, updates, and removes orders through the mock REST API', async () => {
    const orders = TestBed.inject(OrderService);
    const created = await firstValueFrom(orders.create({
      customerId: 'CUS-2048',
      total: 45,
      status: 'pending',
    }));
    expect(created.customer.name).toBe('Olivia Rhye');
    expect(created.items).toEqual([]);

    const updated = await firstValueFrom(orders.update(created.id, {
      customerId: created.customer.id,
      total: created.total,
      status: 'cancelled',
    }));
    expect(updated.status).toBe('cancelled');

    await firstValueFrom(orders.remove(created.id));
    const remaining = await firstValueFrom(orders.list());
    expect(remaining.some((order) => order.id === created.id)).toBe(false);
  });

  it('returns an HTTP not-found error for unknown records', async () => {
    await expect(firstValueFrom(TestBed.inject(OrderService).get('ORD-9999')))
      .rejects.toMatchObject({ status: 404 });
  });
});
