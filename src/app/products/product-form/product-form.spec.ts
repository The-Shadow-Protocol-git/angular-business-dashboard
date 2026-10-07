import { HttpBackend, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { firstValueFrom } from 'rxjs';
import { MockApiBackend } from '../../core/data/mock-api-backend';
import { ProductService } from '../product.service';
import { ProductForm } from './product-form';
import { ProductList } from '../product-list/product-list';

describe('ProductForm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: HttpBackend, useClass: MockApiBackend },
        provideRouter([
          { path: 'products/new', component: ProductForm },
          { path: 'products', component: ProductList },
        ]),
      ],
    });
  });

  it('rejects missing SKU, non-positive prices, and fractional stock values', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/products/new', ProductForm);
    const stock = harness.routeNativeElement?.querySelector('[formControlName="stock"]') as HTMLInputElement;
    stock.value = '1.5';
    stock.dispatchEvent(new Event('input'));
    (harness.routeNativeElement?.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    harness.detectChanges();

    expect(harness.routeNativeElement?.textContent).toContain('SKU is required');
    expect(harness.routeNativeElement?.textContent).toContain('Enter a price greater than zero');
    expect(harness.routeNativeElement?.textContent).toContain('Enter a whole number of zero or more');
  });

  it('creates a product with validated catalog data', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/products/new', ProductForm);
    const root = harness.routeNativeElement as HTMLElement;
    const setValue = (name: string, value: string): void => {
      const input = root.querySelector(`[formControlName="${name}"]`) as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    };
    setValue('name', 'Portfolio Keyboard');
    setValue('sku', 'KEY-100');
    setValue('price', '89.5');
    setValue('stock', '6');
    setValue('category', 'Electronics');
    (root.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    await harness.fixture.whenStable();

    const products = await firstValueFrom(TestBed.inject(ProductService).getProducts());
    expect(products.some((product) => product.sku === 'KEY-100' && product.price === 89.5)).toBe(true);
  });
});
