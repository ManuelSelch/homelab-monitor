import { Component, computed, input, output, signal } from '@angular/core';
import { UiStack } from '../../ui/layout/stack/stack';
import { UiTitle } from '../../ui/title/title';
import { UiText } from '../../ui/text/text';
import { badgeForStatus, UiBadge } from '../../ui/badge/badge';
import { DashboardService, MachineWithServices } from '../../domain/dashboard';
import { Status } from '../../domain/status';
import { UiBox } from '../../ui/box/box';
import { UiGrid } from '../../ui/grid/grid';
import { UiSelect } from '../../ui/input/input';
import { Select } from '../../ui/select/select';

type ServiceStatusFilter = Status | 'all';
type MachineFilter = string | 'all';

@Component({
  imports: [UiStack, UiTitle, UiText, UiBadge, UiBox, UiGrid, UiSelect, Select],
  selector: 'app-services-table',
  templateUrl: './services-table.html',
})
export class ServicesTable {
  machines = input.required<MachineWithServices[]>();
  allServices = input.required<DashboardService[]>();
  selectedMachine = input.required<MachineFilter>();

  machineSelected = output<MachineFilter>();
  logsRequested = output<DashboardService>();

  protected searchTerm = signal('');
  protected statusFilter = signal<ServiceStatusFilter>('all')

  protected filteredServices = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const machine = this.selectedMachine();
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
  protected selectMachine(event: Event) {
    this.machineSelected.emit((event.target as HTMLInputElement).value as MachineFilter);
  }
  protected openLogs(service: DashboardService) {
    this.logsRequested.emit(service);
  }

  protected badgeForStatus = badgeForStatus;
}
