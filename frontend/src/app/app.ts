import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MachineDto } from './api/machine.dto';
import { ServiceDto } from './api/service.dto';
import { AppShell } from './components/app-shell/app-shell';
import { DashboardService, MachineWithServices } from './domain/dashboard';
import { MachineStatus } from './domain/machine';
import { MonitoredService } from './domain/monitored-service';
import { BadgeVariant, UiBadge } from './ui/badge/badge';
import { UiStack } from './ui/stack/stack';
import { UiText } from './ui/text/text';
import { UiTitle } from './ui/title/title';

type ServiceStatusFilter = MachineStatus | 'all';
type MachineFilter = string | 'all';

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
  protected readonly machines = signal<MachineWithServices[]>([]);
  protected readonly unassignedServices = signal<MonitoredService[]>([]);
  protected readonly allServices = signal<DashboardService[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly machineFilter = signal<MachineFilter>('all');
  protected readonly statusFilter = signal<ServiceStatusFilter>('all');

  protected readonly logDrawerService = signal<DashboardService | null>(null);
  protected readonly logs = signal('');
  protected readonly logsLoading = signal(false);
  protected readonly logsError = signal<string | null>(null);

  protected readonly hasDashboardItems = computed(
    () => this.machines().length > 0 || this.unassignedServices().length > 0,
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
      const matchesMachine = machine === 'all' || service.machineId === machine;
      const matchesStatus = status === 'all' || service.status === status;

      return matchesSearch && matchesMachine && matchesStatus;
    });
  });

  constructor() {
    forkJoin({
      machines: this.http.get<MachineDto[]>('/api/machines'),
      services: this.http.get<ServiceDto[]>('/api/services'),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ machines, services }) => {
          const dashboard = toDashboardViewModel(machines, services);

          this.machines.set(dashboard.machines);
          this.unassignedServices.set(dashboard.unassignedServices);
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

  protected serviceCountByStatus(status: MachineStatus): number {
    return this.allServices().filter((service) => service.status === status).length;
  }

  protected badgeForStatus(status: MachineStatus): BadgeVariant {
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
