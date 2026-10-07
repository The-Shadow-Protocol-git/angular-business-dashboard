import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BusinessApiService } from '../core/api/business-api.service';
import { Customer, CustomerWriteRequest } from '../core/models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly api = inject(BusinessApiService);

  getCustomers(): Observable<Customer[]> { return this.api.getCustomers(); }
  getCustomer(id: string): Observable<Customer> { return this.api.getCustomer(id); }
  createCustomer(request: CustomerWriteRequest): Observable<Customer> { return this.api.createCustomer(request); }
  updateCustomer(id: string, request: CustomerWriteRequest): Observable<Customer> { return this.api.updateCustomer(id, request); }
  deleteCustomer(id: string): Observable<void> { return this.api.deleteCustomer(id); }
}
