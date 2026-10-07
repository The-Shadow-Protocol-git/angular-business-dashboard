import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { DashboardData } from '../core/models/dashboard.model';
import { MOCK_DASHBOARD } from '../core/data/mock-data';
import { DashboardService } from '../core/services/dashboard.service';
import { DashboardPage } from './dashboard-page';

describe('DashboardPage', () => {
  let fixture: ComponentFixture<DashboardPage>;
  let response: Subject<DashboardData>;

  beforeEach(async () => {
    response = new Subject<DashboardData>();
    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [provideRouter([]), { provide: DashboardService, useValue: { load: () => response } }],
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardPage);
  });

  it('shows loading, renders KPI data, and updates the selected revenue range', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Loading your business overview');
    response.next(MOCK_DASHBOARD);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('$24,500');
    expect(fixture.nativeElement.textContent).toContain('1,248');
    expect(fixture.nativeElement.querySelectorAll('app-stat-card')).toHaveLength(4);

    const range = fixture.nativeElement.querySelector('#revenue-range') as HTMLSelectElement;
    range.value = '12m';
    range.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.bar')).toHaveLength(12);
  });

  it('shows a recoverable error state', () => {
    fixture.detectChanges();
    response.error(new Error('network'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('We could not load dashboard data');
  });
});
