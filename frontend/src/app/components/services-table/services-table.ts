import { Component, computed, input, output, signal } from '@angular/core';
import { UiStack } from '../../ui/stack/stack';
import { UiTitle } from '../../ui/title/title';
import { UiText } from '../../ui/text/text';
import { badgeForStatus, UiBadge } from '../../ui/badge/badge';
import { DashboardService, MachineWithServices } from '../../domain/dashboard';
import { MachineStatus } from '../../domain/machine';

type ServiceStatusFilter = MachineStatus | 'all';
type MachineFilter = string | 'all';

@Component({
  imports: [UiStack, UiTitle, UiText, UiBadge],
  selector: 'app-services-table',
  templateUrl: './services-table.html',
})
export class ServicesTable {
  machines = input.required<MachineWithServices[]>();
  allServices = input.required<DashboardService[]>();

  logsRequested = output<DashboardService>();

  protected searchTerm = signal('');
  protected statusFilter = signal<ServiceStatusFilter>('all')
  protected machineFilter = signal<MachineFilter>('all')

  protected filteredServices = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const machine = this.machineFilter();
    const status = this.statusFilter();

    return this.allServices().filter((service) => {
      const matchesSearch = 
        search.length === 0 || 
        service.name.toLowerCase().includes(search) ||
        service.type.toLowerCase().includes(search);
      const matchesMachine = machine === 'all' || service.machineId === machine;
      const matchesStatus = status === 'all' || service.status === status;

      return matchesSearch && matchesMachine && matchesStatus;
    })
  });


  protected setSearchTerm(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }
  protected setStatusFilter(event: Event) {
    this.statusFilter.set((event.target as HTMLInputElement).value as ServiceStatusFilter);
  }
  protected setMachineFilter(event: Event) {
    this.machineFilter.set((event.target as HTMLInputElement).value);
  }
  protected openLogs(service: DashboardService) {
    this.logsRequested.emit(service);
  }

  protected badgeForStatus = badgeForStatus;
}
