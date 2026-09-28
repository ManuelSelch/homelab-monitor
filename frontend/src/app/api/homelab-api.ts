import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { MachineDto } from './machine.dto';
import { ServiceDto } from './service.dto';

export type DashboardDataDto = {
  machines: MachineDto[];
  services: ServiceDto[];
};

@Injectable({ providedIn: 'root' })
export class HomelabApi {
  private readonly http = inject(HttpClient);

  getMachines(): Observable<MachineDto[]> {
    return this.http.get<MachineDto[]>('/api/machines');
  }

  getServices(): Observable<ServiceDto[]> {
    return this.http.get<ServiceDto[]>('/api/services');
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
