import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { Machine } from '../domain/machine';
import { MonitoredService } from '../domain/monitored-service';
import { DashboardDataDto } from '../domain/dashboard';

@Injectable({ providedIn: 'root' })
export class HomelabApi {
  private readonly http = inject(HttpClient);

  getMachines(): Observable<Machine[]> {
    return this.http.get<Machine[]>('/api/machines');
  }

  getServices(): Observable<MonitoredService[]> {
    return this.http.get<MonitoredService[]>('/api/services');
  }

  getDashboardData(): Observable<DashboardDataDto> {
    return forkJoin({
      machines: this.getMachines(),
      services: this.getServices(),
    });
  }

  getServiceLogs(serviceId: string): Observable<string> {
    return this.http.get(`/api/services/${serviceId}/logs`, { responseType: 'text' });
  }
}
