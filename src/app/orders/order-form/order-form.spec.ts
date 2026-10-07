import { HttpBackend, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { firstValueFrom } from 'rxjs';
import { MockApiBackend } from '../../core/data/mock-api-backend';
import { Order } from '../../core/models/order.model';
import { OrderService } from '../order.service';
import { OrderForm } from './order-form';
import { OrderList } from '../order-list/order-list';

describe('OrderForm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: HttpBackend, useClass: MockApiBackend },
        provideRouter([
          { path: 'orders/new', component: OrderForm },
          { path: 'orders', component: OrderList },
        ]),
      ],
    });
  });

  it('blocks invalid submission and reports required fields', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/orders/new', OrderForm);
    const submit = harness.routeNativeElement?.querySelector('button[type="submit"]') as HTMLButtonElement;
    submit.click();
    harness.detectChanges();

    expect(harness.routeNativeElement?.textContent).toContain('Choose a customer.');
    expect(harness.routeNativeElement?.textContent).toContain('Choose an available product.');
    expect(harness.routeNativeElement?.textContent).toContain('Select a product and quantity.');
    expect(harness.routeNativeElement?.querySelector('form')).toBeTruthy();
    expect(TestBed.inject(OrderService)).toBeTruthy();
  });

  it('creates an order from a valid customer, product, and quantity', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/orders/new', OrderForm);
    const element = harness.routeNativeElement as HTMLElement;
    const customer = element.querySelector('[formControlName="customerId"]') as HTMLSelectElement;
    customer.value = 'CUS-2048';
    customer.dispatchEvent(new Event('change'));

    const product = element.querySelector('[formControlName="productId"]') as HTMLSelectElement;
    product.value = 'PRD-3201';
    product.dispatchEvent(new Event('change'));

    const quantity = element.querySelector('[formControlName="quantity"]') as HTMLInputElement;
    quantity.value = '2';
    quantity.dispatchEvent(new Event('input'));
    harness.detectChanges();

    const submit = element.querySelector('button[type="submit"]') as HTMLButtonElement;
    submit.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    const orders: Order[] = await firstValueFrom(TestBed.inject(OrderService).getOrders());
    expect(orders[0].customer.id).toBe('CUS-2048');
    expect(orders[0].items[0].quantity).toBe(2);
    expect(orders[0].total).toBe(258);
  });
});
