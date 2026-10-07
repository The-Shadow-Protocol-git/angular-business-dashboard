import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerStatus, CustomerWriteRequest } from '../../core/models/customer.model';
import { apiErrorMessage } from '../../core/api/api-error';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state';
import { FormActionsComponent } from '../../shared/components/form-actions/form-actions';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-customer-form',
  imports: [ReactiveFormsModule, RouterLink, ErrorStateComponent, FormActionsComponent, LoadingStateComponent],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.scss',
})
export class CustomerForm implements OnInit {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(CustomerService);
  protected readonly id = this.route.snapshot.paramMap.get('id');
  protected readonly loading = signal(Boolean(this.id));
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    phone: ['', Validators.maxLength(30)],
    status: ['active' as CustomerStatus, Validators.required],
  });

  ngOnInit(): void {
    if (!this.id) return;
    this.service.getCustomer(this.id).subscribe({
      next: (customer) => { this.form.patchValue(customer); this.loading.set(false); },
      error: (error: unknown) => { this.error.set(apiErrorMessage(error, 'Customer could not be loaded.')); this.loading.set(false); },
    });
  }

  protected hasError(field: 'name' | 'email' | 'phone'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.dirty || control.touched);
  }

  protected save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) return;
    const value = this.form.getRawValue();
    const request: CustomerWriteRequest = {
      name: value.name.trim(), email: value.email.trim(), phone: value.phone.trim(), status: value.status,
    };
    this.saving.set(true);
    this.error.set('');
    const save = this.id ? this.service.updateCustomer(this.id, request) : this.service.createCustomer(request);
    save.subscribe({
      next: () => void this.router.navigate(['/customers']),
      error: (error: unknown) => { this.error.set(apiErrorMessage(error, 'Customer could not be saved. Please try again.')); this.saving.set(false); },
    });
  }
}
