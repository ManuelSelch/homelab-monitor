import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { HomelabApi } from './api/homelab-api';
import { MachineDto } from './api/machine.dto';
import { ServiceDto } from './api/service.dto';
import { AppShell } from './components/app-shell/app-shell';
import { DashboardService, MachineWithServices } from './domain/dashboard';
import { MachineStatus } from './domain/machine';
import { MonitoredService } from './domain/monitored-service';
import { badgeForStatus } from './ui/badge/badge';
import { UiStack } from './ui/stack/stack';
import { UiText } from './ui/text/text';
import { DashboardStats } from './components/dashboard-stats/dashboard-stats';
import { MachinesOverview } from './components/machines-overview/machines-overview';
import { ServicesTable } from './components/services-table/services-table';
import { LogsDrawer } from './components/logs-drawer/logs-drawer';

type MachineFilter = string | 'all';

@Component({
  imports: [RouterOutlet, AppShell, UiStack, UiText, DashboardStats, MachinesOverview, ServicesTable, LogsDrawer],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  private readonly homelabApi = inject(HomelabApi);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isLoading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly machines = signal<MachineWithServices[]>([]);
  protected readonly allServices = signal<DashboardService[]>([]);

  protected readonly machineFilter = signal<MachineFilter>('all');

  protected readonly logDrawerService = signal<DashboardService | null>(null);
  protected readonly logs = signal('');
  protected readonly logsLoading = signal(false);
  protected readonly logsError = signal<string | null>(null);

  protected readonly hasDashboardItems = computed(() => this.machines().length > 0,);

  constructor() {
    this.homelabApi
      .getDashboardData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ machines, services }) => {
          const dashboard = toDashboardViewModel(machines, services);

          this.machines.set(dashboard.machines);
          this.allServices.set(dashboard.allServices);
          this.error.set(null);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Could not load machines and services.');
          this.isLoading.set(false);
        },
      });
  }

  protected setMachineFilter(machineId: string): void {
    this.machineFilter.set(machineId);
  }

  //#region logs
  protected badgeForStatus = badgeForStatus;

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

    this.homelabApi
      .getServiceLogs(serviceId)
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
  //#endregion
}

function toDashboardViewModel(machines: MachineDto[], services: ServiceDto[]) {
  const machineById = new Map(machines.map((machine) => [machine.id, machine]));
  const servicesByMachineId = new Map<string, ServiceDto[]>();

  for (const service of services) {
    if (!service.machineId || !machineById.has(service.machineId)) {
      continue;
    }

    servicesByMachineId.set(service.machineId, [...(servicesByMachineId.get(service.machineId) ?? []), service]);
  }

  const machinesWithServices = machines.map((machine) => {
    const services = (servicesByMachineId.get(machine.id) ?? []).map(toServiceViewModel);

    return {
      id: machine.id,
      name: machine.name,
      status: machine.status ? toStatus(machine.status) : toMachineStatusFromServices(services),
      services: services,
    };
  });

  const unassignedServices = services
    .filter((service) => !service.machineId || !machineById.has(service.machineId))
    .map(toServiceViewModel);

  return {
    machines: machinesWithServices,
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

function toServiceViewModel(service: ServiceDto): MonitoredService {
  return {
    id: service.id,
    name: service.name,
    type: service.type ?? 'Service',
    status: toStatus(service.status),
    url: service.url,
  };
}

function toMachineStatusFromServices(services: MonitoredService[]): MachineStatus {
  if (services.some((service) => service.status === 'Warning')) {
    return 'Warning';
  }

  if (services.length > 0 && services.every((service) => service.status === 'Offline')) {
    return 'Offline';
  }

  return 'Online';
}

function toStatus(status: string | undefined): MachineStatus {
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
