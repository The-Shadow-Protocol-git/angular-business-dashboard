import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RevenuePoint, RevenueRange } from '../../core/models/business.models';

@Component({
  selector: 'app-revenue-overview',
  imports: [CurrencyPipe],
  templateUrl: './revenue-overview.html',
  styleUrl: './revenue-overview.scss',
})
export class RevenueOverviewComponent {
  readonly points = input.required<RevenuePoint[]>();
  readonly range = input.required<RevenueRange>();
  readonly rangeChange = output<RevenueRange>();
  protected readonly maxValue = computed(() => Math.max(...this.points().map((point) => point.value), 1));

  protected changeRange(event: Event): void {
    const range = (event.target as HTMLSelectElement).value as RevenueRange;
    this.rangeChange.emit(range);
  }

  protected height(value: number): string {
    return `${Math.max(8, (value / this.maxValue()) * 100)}%`;
  }
}
