import { HttpBackend, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { MockApiBackend } from '../core/data/mock-api-backend';
import { CustomerWriteRequest } from '../core/models/customer.model';
import { CustomerService } from './customer.service';

describe('CustomerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), { provide: HttpBackend, useClass: MockApiBackend }],
    });
  });

  it('supports customer read and CRUD operations', async () => {
    const service = TestBed.inject(CustomerService);
    const request: CustomerWriteRequest = { name: 'Taylor Test', email: 'taylor@example.com', phone: '555-0100', status: 'active' };
    const created = await firstValueFrom(service.createCustomer(request));
    expect((await firstValueFrom(service.getCustomer(created.id))).email).toBe(request.email);

    const updatedRequest: CustomerWriteRequest = { ...request, status: 'inactive' };
    expect((await firstValueFrom(service.updateCustomer(created.id, updatedRequest))).status).toBe('inactive');
    await firstValueFrom(service.deleteCustomer(created.id));
    expect((await firstValueFrom(service.getCustomers())).some((customer) => customer.id === created.id)).toBe(false);
  });
});
