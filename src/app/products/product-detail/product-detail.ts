import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { apiErrorMessage } from '../../core/api/api-error';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink, ErrorStateComponent, LoadingStateComponent, StatusBadgeComponent],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(ProductService);
  protected readonly product = signal<Product | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  private readonly id = this.route.snapshot.paramMap.get('id') ?? '';

  ngOnInit(): void { this.load(); }
  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.getProduct(this.id).subscribe({
      next: (product) => { this.product.set(product); this.loading.set(false); },
      error: (error: unknown) => { this.error.set(apiErrorMessage(error, 'This product could not be found or loaded.')); this.loading.set(false); },
    });
  }
}
