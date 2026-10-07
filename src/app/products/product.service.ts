import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BusinessApiService } from '../core/api/business-api.service';
import { Product, ProductWriteRequest } from '../core/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly api = inject(BusinessApiService);

  getProducts(): Observable<Product[]> { return this.api.getProducts(); }
  getProduct(id: string): Observable<Product> { return this.api.getProduct(id); }
  createProduct(request: ProductWriteRequest): Observable<Product> { return this.api.createProduct(request); }
  updateProduct(id: string, request: ProductWriteRequest): Observable<Product> { return this.api.updateProduct(id, request); }
  deleteProduct(id: string): Observable<void> { return this.api.deleteProduct(id); }
}
