import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Customer } from '../../core/models/customer.model';
import { apiErrorMessage } from '../../core/api/api-error';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-customer-detail',
  imports: [DatePipe, RouterLink, ErrorStateComponent, LoadingStateComponent, StatusBadgeComponent],
  templateUrl: './customer-detail.html',
  styleUrl: './customer-detail.scss',
})
export class CustomerDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(CustomerService);
  protected readonly customer = signal<Customer | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  private readonly id = this.route.snapshot.paramMap.get('id') ?? '';

  ngOnInit(): void { this.load(); }
  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.getCustomer(this.id).subscribe({
      next: (customer) => { this.customer.set(customer); this.loading.set(false); },
      error: (error: unknown) => { this.error.set(apiErrorMessage(error, 'This customer could not be found or loaded.')); this.loading.set(false); },
    });
  }
}
