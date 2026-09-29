import { Component, input } from '@angular/core';
import { UiText } from '../../ui/typography/text/text';
import { DashboardService, MachineWithServices } from '../../domain/dashboard';
import { Status } from '../../domain/status';
import { UiTitle } from '../../ui/typography/title/title';
import { UiGrid } from '../../ui/layout/grid/grid';
import { UiBox } from '../../ui/layout/box/box';

@Component({
  imports: [UiText, UiTitle, UiGrid, UiBox],
  selector: 'app-dashboard-stats',
  templateUrl: './dashboard-stats.html',
})
export class DashboardStats {
  machines = input.required<MachineWithServices[]>();
  allServices = input.required<DashboardService[]>();

  serviceCountByStatus(status: Status): number {
    return this.allServices().filter((service) => service.status === status).length;
  }
}
