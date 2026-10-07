import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { Order } from '../../core/models/order.model';
import { MOCK_ORDERS } from '../../core/data/mock-data';
import { OrderService } from '../order.service';
import { OrderList } from './order-list';

describe('OrderList', () => {
  let fixture: ComponentFixture<OrderList>;
  let response: Observable<Order[]>;

  beforeEach(async () => {
    const rows: Order[] = Array.from({ length: 9 }, (_, index) => ({
      ...MOCK_ORDERS[index % MOCK_ORDERS.length],
      id: `ORD-${2000 + index}`,
      customer: { ...MOCK_ORDERS[index % MOCK_ORDERS.length].customer, name: `Customer ${String(index + 1).padStart(2, '0')}` },
      status: index === 0 ? 'pending' : 'completed',
    }));
    response = of(rows);
    await TestBed.configureTestingModule({
      imports: [OrderList],
      providers: [provideRouter([]), { provide: OrderService, useValue: { getOrders: () => response, cancelOrder: () => of(rows[0]) } }],
    }).compileComponents();
    fixture = TestBed.createComponent(OrderList);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('renders order data, supports search and status filtering', () => {
    expect(fixture.nativeElement.textContent).toContain('Customer 01');
    const search = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    search.value = 'Customer 02';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(1);

    search.value = '';
    search.dispatchEvent(new Event('input'));
    const status = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    status.value = 'pending';
    status.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(1);
  });

  it('supports sorting and pagination in the shared table', () => {
    const sort = fixture.nativeElement.querySelector('.sort-button') as HTMLButtonElement;
    sort.click();
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('tbody tr td') as HTMLElement).textContent).toContain('Customer 01');

    const next = [...fixture.nativeElement.querySelectorAll('button')].find((button) => button.textContent.includes('Next')) as HTMLButtonElement;
    next.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Page 2 of 2');
    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(1);
  });

  it('shows empty and error states', () => {
    response = of([]);
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No orders yet');

    response = throwError(() => new Error('network'));
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Orders could not be loaded');
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
  });
});
