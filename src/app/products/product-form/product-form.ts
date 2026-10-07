import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductStatus, ProductWriteRequest } from '../../core/models/product.model';
import { apiErrorMessage } from '../../core/api/api-error';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state';
import { FormActionsComponent } from '../../shared/components/form-actions/form-actions';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { ProductService } from '../product.service';

interface ProductFormValue {
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: ProductStatus;
}

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, RouterLink, ErrorStateComponent, FormActionsComponent, LoadingStateComponent],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm implements OnInit {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(ProductService);
  protected readonly id = this.route.snapshot.paramMap.get('id');
  protected readonly loading = signal(Boolean(this.id));
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    sku: ['', [Validators.required, Validators.maxLength(40)]],
    price: [0, [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    stock: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
    category: ['', [Validators.required, Validators.maxLength(60)]],
    status: ['active' as ProductStatus, Validators.required],
  });

  ngOnInit(): void {
    if (!this.id) return;
    this.service.getProduct(this.id).subscribe({
      next: (product) => { this.form.patchValue(product); this.loading.set(false); },
      error: (error: unknown) => { this.error.set(apiErrorMessage(error, 'Product could not be loaded.')); this.loading.set(false); },
    });
  }

  protected hasError(field: keyof ProductFormValue): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.dirty || control.touched);
  }

  protected save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) return;
    const value: ProductFormValue = this.form.getRawValue();
    const request: ProductWriteRequest = {
      name: value.name.trim(),
      sku: value.sku.trim(),
      price: value.price,
      stock: value.stock,
      category: value.category.trim(),
      status: value.status,
    };
    this.saving.set(true);
    this.error.set('');
    const save = this.id ? this.service.updateProduct(this.id, request) : this.service.createProduct(request);
    save.subscribe({
      next: () => void this.router.navigate(['/products']),
      error: (error: unknown) => { this.error.set(apiErrorMessage(error, 'Product could not be saved. Please try again.')); this.saving.set(false); },
    });
  }
}
