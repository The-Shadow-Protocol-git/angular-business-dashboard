import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { apiErrorMessage } from '../../core/api/api-error';
import { DataTableColumn, DataTableComponent } from '../../shared/components/data-table/data-table';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { ProductService } from '../product.service';

type StockFilter = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, DataTableComponent, EmptyStateComponent, ErrorStateComponent, LoadingStateComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  private readonly service = inject(ProductService);
  private readonly router = inject(Router);
  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly query = signal('');
  protected readonly category = signal('all');
  protected readonly stock = signal<StockFilter>('all');
  protected readonly categories = computed(() => [...new Set(this.products().map((product) => product.category))].sort());
  protected readonly columns: DataTableColumn<Product>[] = [
    { key: 'name', header: 'Product', cell: (product) => `${product.name} · ${product.sku}`, sortValue: (product) => product.name },
    { key: 'category', header: 'Category', cell: (product) => product.category, sortValue: (product) => product.category },
    { key: 'price', header: 'Price', cell: (product) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price), sortValue: (product) => product.price },
    { key: 'stock', header: 'Stock', cell: (product) => String(product.stock), sortValue: (product) => product.stock },
    { key: 'status', header: 'Status', cell: (product) => product.stock === 0 ? 'out of stock' : product.status, status: true },
  ];
  protected readonly visibleProducts = computed(() => this.products().filter((product) => {
    const query = this.query().trim().toLowerCase();
    const stock = this.stock();
    const stockMatches = stock === 'all'
      || (stock === 'out-of-stock' && product.stock === 0)
      || (stock === 'low-stock' && product.stock > 0 && product.stock <= 10)
      || (stock === 'in-stock' && product.stock > 10);
    return (!query || `${product.id} ${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(query))
      && (this.category() === 'all' || product.category === this.category())
      && stockMatches;
  }));

  ngOnInit(): void { this.load(); }

  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.getProducts().subscribe({
      next: (products) => { this.products.set(products); this.loading.set(false); },
      error: (error: unknown) => { this.error.set(apiErrorMessage(error, 'Products could not be loaded. Please try again.')); this.loading.set(false); },
    });
  }

  protected search(event: Event): void { this.query.set((event.target as HTMLInputElement).value); }
  protected filterCategory(event: Event): void { this.category.set((event.target as HTMLSelectElement).value); }
  protected filterStock(event: Event): void { this.stock.set((event.target as HTMLSelectElement).value as StockFilter); }
  protected productId(product: Product): string { return product.id; }
  protected viewProduct(product: Product): void { void this.router.navigate(['/products', product.id]); }
  protected editProduct(product: Product): void { void this.router.navigate(['/products', product.id, 'edit']); }
  protected deleteProduct(product: Product): void {
    if (!globalThis.confirm(`Delete product ${product.name}?`)) return;
    this.service.deleteProduct(product.id).subscribe({
      next: () => this.load(),
      error: (error: unknown) => this.error.set(apiErrorMessage(error, `Product ${product.name} could not be deleted. Please try again.`)),
    });
  }
}
