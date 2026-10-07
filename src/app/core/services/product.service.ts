import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductDraft } from '../models/business.models';
import { BusinessApiService } from './business-api.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly api = inject(BusinessApiService);

  list(): Observable<Product[]> { return this.api.getProducts(); }
  get(id: string): Observable<Product> { return this.api.getProduct(id); }
  create(draft: ProductDraft): Observable<Product> { return this.api.createProduct(draft); }
  update(id: string, draft: ProductDraft): Observable<Product> { return this.api.updateProduct(id, draft); }
  remove(id: string): Observable<void> { return this.api.deleteProduct(id); }
}
