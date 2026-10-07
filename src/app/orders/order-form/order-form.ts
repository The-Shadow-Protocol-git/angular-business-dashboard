import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { Customer } from '../../core/models/customer.model';
import { apiErrorMessage } from '../../core/api/api-error';
import { Order, OrderStatus, OrderWriteRequest } from '../../core/models/order.model';
import { Product } from '../../core/models/product.model';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state';
import { FormActionsComponent } from '../../shared/components/form-actions/form-actions';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { CustomerService } from '../../customers/customer.service';
import { ProductService } from '../../products/product.service';
import { OrderService } from '../order.service';

interface OrderFormValue {
  customerId: string;
  productId: string;
  quantity: number;
  total: number;
  status: OrderStatus;
}

@Component({
  selector: 'app-order-form',
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink, ErrorStateComponent, FormActionsComponent, LoadingStateComponent],
  templateUrl: './order-form.html',
  styleUrl: './order-form.scss',
})
export class OrderForm implements OnInit {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ordersApi = inject(OrderService);
  private readonly customersApi = inject(CustomerService);
  private readonly productsApi = inject(ProductService);
  protected readonly id = this.route.snapshot.paramMap.get('id');
  protected readonly customers = signal<Customer[]>([]);
  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly title = this.id ? 'Edit order' : 'New order';
  protected readonly form = this.fb.group({
    customerId: ['', Validators.required],
    productId: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
    total: [0, [Validators.required, Validators.min(0.01)]],
    status: ['pending' as OrderStatus, Validators.required],
  });

  ngOnInit(): void {
    forkJoin({
      customers: this.customersApi.getCustomers(),
      products: this.productsApi.getProducts(),
      order: this.id ? this.ordersApi.getOrder(this.id) : of(null),
    }).subscribe({
      next: ({ customers, products, order }) => {
        this.customers.set(customers);
        this.products.set(products);
        if (order) {
          this.form.patchValue({
            customerId: order.customer.id,
            productId: order.items[0]?.productId ?? '',
            quantity: order.items[0]?.quantity ?? 1,
            total: order.total,
            status: order.status,
          });
          this.updateStockValidator();
        }
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error, 'Order options or details could not be loaded. Please try again.'));
        this.loading.set(false);
      },
    });
  }

  protected productChanged(): void {
    const product = this.selectedProduct();
    this.updateStockValidator();
    if (product) this.form.controls.total.setValue(product.price * this.form.controls.quantity.value);
  }

  protected quantityChanged(): void {
    this.updateStockValidator();
    const product = this.selectedProduct();
    if (product) this.form.controls.total.setValue(product.price * this.form.controls.quantity.value);
  }

  protected hasError(field: keyof OrderFormValue): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.dirty || control.touched);
  }

  protected save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) return;
    const product = this.selectedProduct();
    const quantity = this.form.controls.quantity.value;
    if (!product || product.status !== 'active' || quantity > product.stock) return;

    const value: OrderFormValue = this.form.getRawValue();
    const request: OrderWriteRequest = {
      customerId: value.customerId,
      total: value.total,
      status: value.status,
      items: [{ productId: product.id, productName: product.name, quantity, unitPrice: product.price }],
    };
    this.saving.set(true);
    this.error.set('');
    const save = this.id ? this.ordersApi.updateOrder(this.id, request) : this.ordersApi.createOrder(request);
    save.subscribe({
      next: () => void this.router.navigate(['/orders']),
      error: (error: unknown) => { this.error.set(apiErrorMessage(error, 'Order could not be saved. Check the details and try again.')); this.saving.set(false); },
    });
  }

  private selectedProduct(): Product | undefined {
    return this.products().find((product) => product.id === this.form.controls.productId.value);
  }

  private updateStockValidator(): void {
    const product = this.selectedProduct();
    const quantity = this.form.controls.quantity;
    quantity.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^\d+$/),
      ...(product ? [Validators.max(product.stock)] : []),
    ]);
    quantity.updateValueAndValidity({ emitEvent: false });
  }
}
