import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DashboardData, RevenueRange } from '../core/models/business.models';
import { DashboardService } from '../core/services/dashboard.service';
import { RecentOrdersComponent } from './recent-orders/recent-orders';
import { RevenueOverviewComponent } from './revenue-overview/revenue-overview';
import { StatCardComponent } from './stat-card/stat-card';

interface StatCardView {
  label: string;
  value: string;
  change: number;
  icon: string;
  prefix?: string;
  suffix?: string;
}

@Component({
  selector: 'app-dashboard-page',
  imports: [StatCardComponent, RevenueOverviewComponent, RecentOrdersComponent],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {
  private readonly dashboard = inject(DashboardService);
  protected readonly data = signal<DashboardData | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly range = signal<RevenueRange>('6m');
  protected readonly revenue = computed(() => this.data()?.revenue[this.range()] ?? []);
  protected readonly stats = computed<StatCardView[]>(() => {
    const stats = this.data()?.stats;
    if (!stats) return [];
    return [
      { label: 'Revenue', value: this.money(stats.revenue), change: stats.revenueChange, icon: '$', prefix: '$' },
      { label: 'Orders', value: this.count(stats.orders), change: stats.ordersChange, icon: '#' },
      { label: 'Customers', value: this.count(stats.customers), change: stats.customersChange, icon: '◎' },
      { label: 'Conversion rate', value: stats.conversionRate.toFixed(1), change: stats.conversionChange, icon: '%', suffix: '%' },
    ];
  });

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    this.dashboard.load().subscribe({
      next: (data) => { this.data.set(data); this.loading.set(false); },
      error: () => { this.error.set('We could not load dashboard data. Please try again.'); this.loading.set(false); },
    });
  }

  protected changeRange(range: RevenueRange): void {
    this.range.set(range);
  }

  protected money(value: number): string {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
  }

  protected count(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }
}
