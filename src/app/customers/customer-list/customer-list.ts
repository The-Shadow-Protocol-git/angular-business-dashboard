import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Customer, CustomerStatus } from '../../core/models/customer.model';
import { apiErrorMessage } from '../../core/api/api-error';
import { DataTableColumn, DataTableComponent } from '../../shared/components/data-table/data-table';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-customer-list',
  imports: [RouterLink, DataTableComponent, EmptyStateComponent, ErrorStateComponent, LoadingStateComponent],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss',
})
export class CustomerList implements OnInit {
  private readonly service = inject(CustomerService);
  private readonly router = inject(Router);
  protected readonly customers = signal<Customer[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly query = signal('');
  protected readonly status = signal<'all' | CustomerStatus>('all');
  protected readonly columns: DataTableColumn<Customer>[] = [
    { key: 'name', header: 'Customer', cell: (customer) => `${customer.name} · ${customer.id}`, sortValue: (customer) => customer.name },
    { key: 'email', header: 'Email', cell: (customer) => customer.email, sortValue: (customer) => customer.email },
    { key: 'phone', header: 'Phone', cell: (customer) => customer.phone || '—' },
    { key: 'created', header: 'Customer since', cell: (customer) => new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(customer.createdAt)), sortValue: (customer) => customer.createdAt },
    { key: 'status', header: 'Status', cell: (customer) => customer.status, status: true },
  ];
  protected readonly visibleCustomers = computed(() => this.customers().filter((customer) => {
    const query = this.query().trim().toLowerCase();
    return (!query || `${customer.id} ${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(query))
      && (this.status() === 'all' || customer.status === this.status());
  }));

  ngOnInit(): void { this.load(); }

  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.getCustomers().subscribe({
      next: (customers) => { this.customers.set(customers); this.loading.set(false); },
      error: (error: unknown) => { this.error.set(apiErrorMessage(error, 'Customers could not be loaded. Please try again.')); this.loading.set(false); },
    });
  }

  protected search(event: Event): void { this.query.set((event.target as HTMLInputElement).value); }
  protected filterStatus(event: Event): void { this.status.set((event.target as HTMLSelectElement).value as 'all' | CustomerStatus); }
  protected customerId(customer: Customer): string { return customer.id; }
  protected viewCustomer(customer: Customer): void { void this.router.navigate(['/customers', customer.id]); }
  protected editCustomer(customer: Customer): void { void this.router.navigate(['/customers', customer.id, 'edit']); }

  protected deleteCustomer(customer: Customer): void {
    if (!globalThis.confirm(`Delete customer ${customer.name}?`)) return;
    this.service.deleteCustomer(customer.id).subscribe({
      next: () => this.load(),
      error: (error: unknown) => this.error.set(apiErrorMessage(error, `Customer ${customer.name} could not be deleted. Please try again.`)),
    });
  }
}
