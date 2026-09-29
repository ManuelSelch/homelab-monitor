import { Component, input } from '@angular/core';
import { UiText } from '../../ui/typography/text/text';
import { DashboardService, MachineWithServices } from '../../domain/dashboard';
import { Status } from '../../domain/status';
import { UiStack } from '../../ui/layout/stack/stack';
import { HlmCard } from '@spartan-ng/helm/card';
import { UiTitle } from '../../ui/typography/title/title';
import { UiHStack } from '../../ui/layout/hstack/hstack';
import { UiGrid } from '../../ui/layout/grid/grid';
import { UiBox } from '../../ui/layout/box/box';

@Component({
  imports: [UiText, UiStack, HlmCard, UiTitle, UiHStack, UiGrid, UiBox],
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
