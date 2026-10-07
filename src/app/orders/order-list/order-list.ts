import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Order, OrderStatus } from '../../core/models/order.model';
import { apiErrorMessage } from '../../core/api/api-error';
import { OrderService } from '../order.service';
import { DataTableColumn, DataTableComponent } from '../../shared/components/data-table/data-table';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';

@Component({
  selector: 'app-order-list',
  imports: [RouterLink, DataTableComponent, EmptyStateComponent, ErrorStateComponent, LoadingStateComponent],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})
export class OrderList implements OnInit {
  private readonly service = inject(OrderService);
  private readonly router = inject(Router);
  protected readonly orders = signal<Order[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly query = signal('');
  protected readonly status = signal<'all' | OrderStatus>('all');
  protected readonly columns: DataTableColumn<Order>[] = [
    { key: 'customer', header: 'Customer', cell: (order) => `${order.customer.name} · ${order.id}`, sortValue: (order) => order.customer.name },
    { key: 'email', header: 'Email', cell: (order) => order.customer.email },
    { key: 'total', header: 'Total', cell: (order) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.total), sortValue: (order) => order.total },
    { key: 'date', header: 'Date', cell: (order) => new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(order.createdAt)), sortValue: (order) => order.createdAt },
    { key: 'status', header: 'Status', cell: (order) => order.status, status: true },
  ];
  protected readonly visibleOrders = computed(() => this.orders().filter((order) => {
    const query = this.query().trim().toLowerCase();
    return (!query || `${order.id} ${order.customer.name} ${order.customer.email}`.toLowerCase().includes(query))
      && (this.status() === 'all' || order.status === this.status());
  }));

  ngOnInit(): void { this.load(); }

  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.getOrders().subscribe({
      next: (orders) => { this.orders.set(orders); this.loading.set(false); },
      error: (error: unknown) => { this.error.set(apiErrorMessage(error, 'Orders could not be loaded. Please try again.')); this.loading.set(false); },
    });
  }

  protected search(event: Event): void { this.query.set((event.target as HTMLInputElement).value); }
  protected filterStatus(event: Event): void { this.status.set((event.target as HTMLSelectElement).value as 'all' | OrderStatus); }
  protected orderId(order: Order): string { return order.id; }
  protected canCancel(order: Order): boolean { return order.status === 'pending' || order.status === 'processing'; }
  protected viewOrder(order: Order): void { void this.router.navigate(['/orders', order.id]); }
  protected editOrder(order: Order): void { void this.router.navigate(['/orders', order.id, 'edit']); }

  protected cancelOrder(order: Order): void {
    if (!this.canCancel(order) || !globalThis.confirm(`Cancel order ${order.id}?`)) return;
    this.service.cancelOrder(order.id).subscribe({
      next: () => this.load(),
      error: (error: unknown) => this.error.set(apiErrorMessage(error, `Order ${order.id} could not be cancelled. Please try again.`)),
    });
  }
}
