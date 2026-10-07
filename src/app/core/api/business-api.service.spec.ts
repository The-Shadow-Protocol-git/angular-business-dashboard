import { HttpBackend, HttpClient, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { MockApiBackend } from '../data/mock-api-backend';
import { DashboardService } from '../services/dashboard.service';

describe('BusinessApiService and mock backend', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), { provide: HttpBackend, useClass: MockApiBackend }],
    });
  });

  it('serves typed dashboard data through HTTP', async () => {
    const dashboard = await firstValueFrom(TestBed.inject(DashboardService).load());

    expect(dashboard.stats.revenue).toBeGreaterThan(0);
    expect(dashboard.revenue['6m']).toHaveLength(6);
    expect(dashboard.recentOrders.length).toBeGreaterThan(0);
  });

  it('returns a not-found response for missing records', async () => {
    await expect(firstValueFrom(TestBed.inject(HttpClient).get('/api/orders/ORD-9999')))
      .rejects.toMatchObject({ status: 404 });
  });
});
