import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Order } from '../../core/models/order.model';
import { apiErrorMessage } from '../../core/api/api-error';
import { OrderService } from '../order.service';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-order-detail',
  imports: [CurrencyPipe, DatePipe, RouterLink, ErrorStateComponent, LoadingStateComponent, StatusBadgeComponent],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss',
})
export class OrderDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(OrderService);
  protected readonly order = signal<Order | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  private readonly id = this.route.snapshot.paramMap.get('id') ?? '';

  ngOnInit(): void { this.load(); }

  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.getOrder(this.id).subscribe({
      next: (order) => { this.order.set(order); this.loading.set(false); },
      error: (error: unknown) => { this.error.set(apiErrorMessage(error, 'This order could not be found or loaded.')); this.loading.set(false); },
    });
  }
}
