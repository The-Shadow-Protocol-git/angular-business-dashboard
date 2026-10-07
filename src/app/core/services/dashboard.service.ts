import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardData } from '../models/business.models';
import { BusinessApiService } from './business-api.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly api = inject(BusinessApiService);

  load(): Observable<DashboardData> {
    return this.api.getDashboard();
  }
}
