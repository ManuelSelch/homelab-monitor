import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AppShell } from './components/app-shell/app-shell';
import { VmService, VmStatus, VmWithServices } from './components/vm-card/vm-card';
import { BadgeVariant, UiBadge } from './ui/badge/badge';
import { UiStack } from './ui/stack/stack';
import { UiText } from './ui/text/text';
import { UiTitle } from './ui/title/title';

type HomelabMachine = {
  id: string;
  name: string;
  status: string;
  cpuUsage: number;
  memoryUsage: number;
};

type HomelabService = {
  id: string;
  name: string;
  status: string;
  machineId?: string;
  type?: string;
  url?: string;
};

type ServiceStatusFilter = VmStatus | 'all';
type MachineFilter = string | 'all' | 'unassigned';

type DashboardService = VmService & {
  machineId?: string;
  machineName: string;
};

@Component({
  imports: [RouterOutlet, AppShell, UiBadge, UiStack, UiText, UiTitle],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isLoading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly vms = signal<VmWithServices[]>([]);
  protected readonly unassignedServices = signal<VmService[]>([]);
  protected readonly allServices = signal<DashboardService[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly machineFilter = signal<MachineFilter>('all');
  protected readonly statusFilter = signal<ServiceStatusFilter>('all');

  protected readonly logDrawerService = signal<DashboardService | null>(null);
  protected readonly logs = signal('');
  protected readonly logsLoading = signal(false);
  protected readonly logsError = signal<string | null>(null);

  protected readonly hasDashboardItems = computed(
    () => this.vms().length > 0 || this.unassignedServices().length > 0,
  );

  protected readonly filteredServices = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const machine = this.machineFilter();
    const status = this.statusFilter();

    return this.allServices().filter((service) => {
      const matchesSearch =
        search.length === 0 ||
        service.name.toLowerCase().includes(search) ||
        service.type.toLowerCase().includes(search) ||
        service.machineName.toLowerCase().includes(search);
      const matchesMachine =
        machine === 'all' ||
        (machine === 'unassigned' ? !service.machineId : service.machineId === machine);
      const matchesStatus = status === 'all' || service.status === status;

      return matchesSearch && matchesMachine && matchesStatus;
    });
  });

  constructor() {
    forkJoin({
      vms: this.http.get<HomelabMachine[]>('/api/machines'),
      services: this.http.get<HomelabService[]>('/api/services'),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ vms, services }) => {
          const dashboard = toDashboardViewModel(vms, services);

          this.vms.set(dashboard.vms);
          this.unassignedServices.set(dashboard.unassignedServices);
          this.allServices.set(dashboard.allServices);
          this.error.set(null);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Could not load VMs and services.');
          this.isLoading.set(false);
        },
      });
  }

  protected serviceCountByStatus(status: VmStatus): number {
    return this.allServices().filter((service) => service.status === status).length;
  }

  protected badgeForStatus(status: VmStatus): BadgeVariant {
    switch (status) {
      case 'Online':
        return 'success';
      case 'Warning':
        return 'warning';
      case 'Offline':
        return 'danger';
    }
  }

  protected setSearchTerm(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  protected setMachineFilter(machineId: string): void {
    this.machineFilter.set(machineId);
  }

  protected setMachineFilterFromEvent(event: Event): void {
    this.machineFilter.set((event.target as HTMLSelectElement).value as MachineFilter);
  }

  protected setStatusFilter(event: Event): void {
    this.statusFilter.set((event.target as HTMLSelectElement).value as ServiceStatusFilter);
  }

  protected openLogs(service: DashboardService): void {
    this.logDrawerService.set(service);
    this.loadLogs(service.id);
  }

  protected refreshLogs(): void {
    const service = this.logDrawerService();

    if (service) {
      this.loadLogs(service.id);
    }
  }

  protected closeLogs(): void {
    this.logDrawerService.set(null);
    this.logs.set('');
    this.logsError.set(null);
    this.logsLoading.set(false);
  }

  private loadLogs(serviceId: string): void {
    this.logs.set('');
    this.logsError.set(null);
    this.logsLoading.set(true);

    this.http
      .get(`/api/services/${serviceId}/logs`, { responseType: 'text' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (logs) => {
          this.logs.set(logs || 'No logs available.');
          this.logsLoading.set(false);
        },
        error: () => {
          this.logsError.set('Could not load service logs.');
          this.logsLoading.set(false);
        },
      });
  }
}

function toDashboardViewModel(vms: HomelabMachine[], services: HomelabService[]) {
  const machineById = new Map(vms.map((vm) => [vm.id, vm]));
  const servicesByMachineId = new Map<string, HomelabService[]>();

  for (const service of services) {
    if (!service.machineId || !machineById.has(service.machineId)) {
      continue;
    }

    servicesByMachineId.set(service.machineId, [...(servicesByMachineId.get(service.machineId) ?? []), service]);
  }

  const vmsWithServices = vms.map((vm) => {
    const vmServices = (servicesByMachineId.get(vm.id) ?? []).map(toServiceViewModel);

    return {
      id: vm.id,
      name: vm.name,
      status: vm.status ? toStatus(vm.status) : toVmStatusFromServices(vmServices),
      services: vmServices,
    };
  });

  const unassignedServices = services
    .filter((service) => !service.machineId || !machineById.has(service.machineId))
    .map(toServiceViewModel);

  return {
    vms: vmsWithServices,
    unassignedServices,
    allServices: services.map((service) => {
      const machine = service.machineId ? machineById.get(service.machineId) : undefined;

      return {
        ...toServiceViewModel(service),
        machineId: machine?.id,
        machineName: machine?.name ?? 'Unassigned',
      };
    }),
  };
}

function toServiceViewModel(service: HomelabService): VmService {
  return {
    id: service.id,
    name: service.name,
    type: service.type ?? 'Service',
    status: toStatus(service.status),
    url: service.url,
  };
}

function toVmStatusFromServices(services: VmService[]): VmStatus {
  if (services.some((service) => service.status === 'Warning')) {
    return 'Warning';
  }

  if (services.length > 0 && services.every((service) => service.status === 'Offline')) {
    return 'Offline';
  }

  return 'Online';
}

function toStatus(status: string | undefined): VmStatus {
  switch (status?.toLowerCase()) {
    case 'up':
    case 'online':
    case 'healthy':
      return 'Online';
    case 'warning':
    case 'degraded':
      return 'Warning';
    case 'down':
    case 'offline':
    default:
      return 'Offline';
  }
}
