import { HttpBackend, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { firstValueFrom } from 'rxjs';
import { MockApiBackend } from '../../core/data/mock-api-backend';
import { CustomerService } from '../customer.service';
import { CustomerForm } from './customer-form';
import { CustomerList } from '../customer-list/customer-list';

describe('CustomerForm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: HttpBackend, useClass: MockApiBackend },
        provideRouter([
          { path: 'customers/new', component: CustomerForm },
          { path: 'customers', component: CustomerList },
        ]),
      ],
    });
  });

  it('requires a valid name and email before saving', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/customers/new', CustomerForm);
    (harness.routeNativeElement?.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    harness.detectChanges();

    expect(harness.routeNativeElement?.textContent).toContain('Name is required');
    expect(harness.routeNativeElement?.textContent).toContain('Enter a valid email address');
  });

  it('creates a customer with the feature form', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/customers/new', CustomerForm);
    const root = harness.routeNativeElement as HTMLElement;
    const name = root.querySelector('[formControlName="name"]') as HTMLInputElement;
    name.value = 'Taylor Test';
    name.dispatchEvent(new Event('input'));
    const email = root.querySelector('[formControlName="email"]') as HTMLInputElement;
    email.value = 'taylor@example.com';
    email.dispatchEvent(new Event('input'));
    (root.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    await harness.fixture.whenStable();

    const customers = await firstValueFrom(TestBed.inject(CustomerService).getCustomers());
    expect(customers.some((customer) => customer.email === 'taylor@example.com')).toBe(true);
  });
});
