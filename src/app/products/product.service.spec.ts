import { HttpBackend, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { MockApiBackend } from '../core/data/mock-api-backend';
import { ProductWriteRequest } from '../core/models/product.model';
import { ProductService } from './product.service';

describe('ProductService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), { provide: HttpBackend, useClass: MockApiBackend }],
    });
  });

  it('supports product read and CRUD operations', async () => {
    const service = TestBed.inject(ProductService);
    const request: ProductWriteRequest = { name: 'Test product', sku: 'TST-001', price: 15.5, stock: 4, category: 'Testing', status: 'active' };
    const created = await firstValueFrom(service.createProduct(request));
    expect((await firstValueFrom(service.getProduct(created.id))).sku).toBe(request.sku);

    const updatedRequest: ProductWriteRequest = { ...request, stock: 8 };
    expect((await firstValueFrom(service.updateProduct(created.id, updatedRequest))).stock).toBe(8);
    await firstValueFrom(service.deleteProduct(created.id));
    expect((await firstValueFrom(service.getProducts())).some((product) => product.id === created.id)).toBe(false);
  });
});
