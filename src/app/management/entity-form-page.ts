import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Customer, EntityType, Product } from '../core/models/business.models';
import { CustomerService } from '../core/services/customer.service';
import { ProductService } from '../core/services/product.service';
import { EntityFormValue, ManagementService } from '../core/services/management.service';

@Component({
  selector: 'app-entity-form-page',
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './entity-form-page.html',
  styleUrl: './entity-form-page.scss',
})
export class EntityFormPage implements OnInit {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly management = inject(ManagementService);
  private readonly customerService = inject(CustomerService);
  private readonly productService = inject(ProductService);
  protected readonly type = this.route.snapshot.data['entity'] as EntityType;
  protected readonly id = this.route.snapshot.paramMap.get('id');
  protected readonly loading = signal(Boolean(this.id));
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly customers = signal<Customer[]>([]);
  protected readonly products = signal<Product[]>([]);
  protected readonly title = `${this.id ? 'Edit' : 'New'} ${this.type.slice(0, -1)}`;
  protected readonly form = this.fb.group({
    name: [''],
    email: [''],
    phone: [''],
    customerId: [''],
    productId: [''],
    quantity: ['1'],
    total: [''],
    status: ['active'],
    sku: [''],
    price: [''],
    stock: [''],
    category: [''],
  });

  constructor() {
    if (this.type === 'orders') {
      this.form.controls.status.setValue('pending');
      this.customerService.list().subscribe({
        next: (customers) => this.customers.set(customers),
        error: () => this.error.set('Customer options could not be loaded. Try refreshing the page.'),
      });
      this.productService.list().subscribe({
        next: (products) => this.products.set(products),
        error: () => this.error.set('Product options could not be loaded. Try refreshing the page.'),
      });
      this.form.controls.customerId.addValidators(Validators.required);
      this.form.controls.productId.addValidators(Validators.required);
      this.form.controls.quantity.addValidators([Validators.required, Validators.pattern(/^\d+$/), Validators.min(1)]);
      this.form.controls.total.addValidators([Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(0.01)]);
    } else if (this.type === 'customers') {
      this.form.controls.name.addValidators([Validators.required, Validators.maxLength(100)]);
      this.form.controls.email.addValidators([Validators.required, Validators.email, Validators.maxLength(254)]);
      this.form.controls.phone.addValidators([Validators.required, Validators.maxLength(30)]);
    } else {
      this.form.controls.name.addValidators([Validators.required, Validators.maxLength(100)]);
      this.form.controls.sku.addValidators([Validators.required, Validators.maxLength(40)]);
      this.form.controls.price.addValidators([Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(0.01)]);
      this.form.controls.stock.addValidators([Validators.required, Validators.pattern(/^\d+$/), Validators.min(0)]);
      this.form.controls.category.addValidators([Validators.required, Validators.maxLength(60)]);
    }
    Object.values(this.form.controls).forEach((control) => control.updateValueAndValidity({ emitEvent: false }));
  }

  ngOnInit(): void {
    if (!this.id) return;
    this.management.formValue(this.type, this.id).subscribe({
      next: (value) => {
        this.form.patchValue(value);
        this.updateQuantityValidators();
        this.loading.set(false);
      },
      error: () => { this.error.set(`Unable to load ${this.type.slice(0, -1)} details.`); this.loading.set(false); },
    });
  }

  protected hasError(field: keyof EntityFormValue): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.dirty || control.touched);
  }

  protected setOrderTotal(): void {
    const product = this.products().find((item) => item.id === this.form.controls.productId.value);
    const quantity = Number(this.form.controls.quantity.value);
    this.updateQuantityValidators();
    if (product && product.status === 'active' && product.stock > 0 && Number.isInteger(quantity) && quantity > 0) {
      this.form.controls.total.setValue((product.price * quantity).toFixed(2));
    }
  }

  private updateQuantityValidators(): void {
    const product = this.products().find((item) => item.id === this.form.controls.productId.value);
    const quantityControl = this.form.controls.quantity;
    quantityControl.setValidators([
      Validators.required,
      Validators.pattern(/^\d+$/),
      Validators.min(1),
      ...(product?.status === 'active' && product.stock > 0 ? [Validators.max(product.stock)] : []),
    ]);
    quantityControl.updateValueAndValidity({ emitEvent: false });
  }

  protected save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    this.error.set('');
    this.management.save(this.type, this.id, this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/', this.type]),
      error: () => { this.error.set(`Unable to save this ${this.type.slice(0, -1)}. Please try again.`); this.saving.set(false); },
    });
  }
}
