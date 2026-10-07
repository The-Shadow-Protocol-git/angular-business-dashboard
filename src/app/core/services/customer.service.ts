import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer, CustomerDraft } from '../models/business.models';
import { BusinessApiService } from './business-api.service';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly api = inject(BusinessApiService);

  list(): Observable<Customer[]> { return this.api.getCustomers(); }
  get(id: string): Observable<Customer> { return this.api.getCustomer(id); }
  create(draft: CustomerDraft): Observable<Customer> { return this.api.createCustomer(draft); }
  update(id: string, draft: CustomerDraft): Observable<Customer> { return this.api.updateCustomer(id, draft); }
  remove(id: string): Observable<void> { return this.api.deleteCustomer(id); }
}
