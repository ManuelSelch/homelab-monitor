import { Component, input } from '@angular/core';
import { UiText } from '../../ui/text/text';
import { DashboardService, MachineWithServices } from '../../domain/dashboard';
import { MachineStatus } from '../../domain/machine';

@Component({
  imports: [UiText],
  selector: 'app-dashboard-stats',
  templateUrl: './dashboard-stats.html',
})
export class DashboardStats {
  machines = input.required<MachineWithServices[]>();
  allServices = input.required<DashboardService[]>();

  serviceCountByStatus(status: MachineStatus): number {
    return this.allServices().filter((service) => service.status === status).length;
  }
}
