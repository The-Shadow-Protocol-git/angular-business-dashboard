import { Component, computed, effect, input, output, signal } from '@angular/core';
import { StatusBadgeComponent } from '../status-badge/status-badge';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => string;
  sortValue?: (row: T) => string | number;
  status?: boolean;
}

@Component({
  selector: 'app-data-table',
  imports: [StatusBadgeComponent],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTableComponent<T extends object> {
  readonly rows = input.required<readonly T[]>();
  readonly columns = input.required<readonly DataTableColumn<T>[]>();
  readonly trackBy = input.required<(row: T) => string>();
  readonly pageSize = input(8);
  readonly removeLabel = input('Delete');
  readonly canRemove = input<(row: T) => boolean>(() => true);
  readonly view = output<T>();
  readonly edit = output<T>();
  readonly remove = output<T>();

  protected readonly page = signal(1);
  protected readonly sortKey = signal<string | null>(null);
  protected readonly ascending = signal(true);
  private readonly resetPageForNewRows = effect(() => {
    this.rows();
    this.page.set(1);
  });
  protected readonly pageCount = computed(() => Math.max(1, Math.ceil(this.sortedRows().length / this.pageSize())));
  protected readonly sortedRows = computed(() => {
    const rows = [...this.rows()];
    const key = this.sortKey();
    const column = this.columns().find((item) => item.key === key);
    if (!column?.sortValue) return rows;
    const direction = this.ascending() ? 1 : -1;
    return rows.sort((left, right) => {
      const sortValue = column.sortValue;
      if (!sortValue) return 0;
      const a = sortValue(left);
      const b = sortValue(right);
      if (typeof a === 'number' && typeof b === 'number') return (a - b) * direction;
      return String(a).localeCompare(String(b), undefined, { numeric: true }) * direction;
    });
  });
  protected readonly visibleRows = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.sortedRows().slice(start, start + this.pageSize());
  });

  protected sort(column: DataTableColumn<T>): void {
    if (!column.sortValue) return;
    if (this.sortKey() === column.key) this.ascending.update((value) => !value);
    else {
      this.sortKey.set(column.key);
      this.ascending.set(true);
    }
    this.page.set(1);
  }

  protected setPage(value: number): void {
    this.page.set(Math.max(1, Math.min(value, this.pageCount())));
  }

  protected rowKey(row: T): string {
    return this.trackBy()(row);
  }

  protected canRemoveRow(row: T): boolean {
    return this.canRemove()(row);
  }

  protected start(): number {
    return this.sortedRows().length ? (this.page() - 1) * this.pageSize() + 1 : 0;
  }

  protected end(): number {
    return Math.min(this.page() * this.pageSize(), this.sortedRows().length);
  }
}
