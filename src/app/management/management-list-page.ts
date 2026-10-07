import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { EntityType, ManagedRow } from '../core/models/business.models';
import { ManagementService } from '../core/services/management.service';

@Component({
  selector: 'app-management-list-page',
  imports: [CurrencyPipe, DatePipe, TitleCasePipe, RouterLink],
  templateUrl: './management-list-page.html',
  styleUrl: './management-list-page.scss',
})
export class ManagementListPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly management = inject(ManagementService);
  protected readonly type = this.route.snapshot.data['entity'] as EntityType;
  protected readonly rows = signal<ManagedRow[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly search = signal('');
  protected readonly status = signal('all');
  protected readonly category = signal('all');
  protected readonly sort = signal<'primary' | 'date' | 'value'>('date');
  protected readonly ascending = signal(false);
  protected readonly page = signal(1);
  protected readonly pageSize = 6;
  protected readonly entityName = this.type.slice(0, -1);
  protected readonly title = computed(() => this.type.charAt(0).toUpperCase() + this.type.slice(1));
  protected readonly statuses = computed(() => [...new Set(this.rows().map((row) => row.status))].sort());
  protected readonly categories = computed(() => [...new Set(this.rows().map((row) => row.secondary.split(' · ')[1]).filter((value): value is string => Boolean(value)))].sort());
  protected readonly filteredRows = computed(() => {
    const query = this.search().trim().toLowerCase();
    const matching = this.rows().filter((row) =>
      (!query || `${row.id} ${row.primary} ${row.secondary}`.toLowerCase().includes(query))
      && (this.status() === 'all' || row.status === this.status())
      && (this.category() === 'all' || row.secondary.split(' · ')[1] === this.category()),
    );
    return matching.sort((left, right) => {
      const comparison = this.sort() === 'date'
        ? left.date.localeCompare(right.date)
        : this.sort() === 'value' ? left.value - right.value : left.primary.localeCompare(right.primary);
      return this.ascending() ? comparison : -comparison;
    });
  });
  protected readonly pageCount = computed(() => Math.max(1, Math.ceil(this.filteredRows().length / this.pageSize)));
  protected readonly pageRows = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredRows().slice(start, start + this.pageSize);
  });

  ngOnInit(): void { this.load(); }

  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    this.management.list(this.type).subscribe({
      next: (rows) => { this.rows.set(rows); this.loading.set(false); },
      error: () => { this.error.set(`Unable to load ${this.type}. Please try again.`); this.loading.set(false); },
    });
  }

  protected setSearch(value: string): void { this.search.set(value); this.page.set(1); }
  protected setStatus(value: string): void { this.status.set(value); this.page.set(1); }
  protected setCategory(value: string): void { this.category.set(value); this.page.set(1); }
  protected searchChanged(event: Event): void { this.setSearch((event.target as HTMLInputElement).value); }
  protected statusChanged(event: Event): void { this.setStatus((event.target as HTMLSelectElement).value); }
  protected categoryChanged(event: Event): void { this.setCategory((event.target as HTMLSelectElement).value); }
  protected get visibleStart(): number { return this.filteredRows().length === 0 ? 0 : (this.page() - 1) * this.pageSize + 1; }
  protected get visibleEnd(): number { return Math.min(this.page() * this.pageSize, this.filteredRows().length); }

  protected toggleSort(column: 'primary' | 'date' | 'value'): void {
    if (this.sort() === column) this.ascending.update((value) => !value);
    else { this.sort.set(column); this.ascending.set(column === 'primary'); }
  }

  protected remove(row: ManagedRow): void {
    const action = this.type === 'orders' ? 'cancel this order' : `delete this ${this.entityName}`;
    if (!globalThis.confirm(`Are you sure you want to ${action}?`)) return;
    const request: Observable<unknown> = this.type === 'orders'
      ? this.management.cancelOrder(row.id)
      : this.management.remove(this.type, row.id);
    request.subscribe({
      next: () => this.load(),
      error: () => this.error.set(`Unable to ${action}. Please try again.`),
    });
  }

  protected setPage(page: number): void {
    this.page.set(Math.min(this.pageCount(), Math.max(1, page)));
  }
}
