import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AppShell } from './components/app-shell/app-shell';
import { VmCard, VmService, VmStatus, VmWithServices } from './components/vm-card/vm-card';
import { ServiceCard } from './components/service-card/service-card';
import { UiStack } from './ui/stack/stack';
import { UiText } from './ui/text/text';

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

@Component({
  imports: [RouterOutlet, AppShell, VmCard, ServiceCard, UiStack, UiText],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  private readonly http = inject(HttpClient);

  protected readonly isLoading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly vms = signal<VmWithServices[]>([]);
  protected readonly unassignedServices = signal<VmService[]>([]);
  protected readonly hasDashboardItems = computed(
    () => this.vms().length > 0 || this.unassignedServices().length > 0,
  );

  constructor() {
    forkJoin({
      vms: this.http.get<HomelabMachine[]>('/api/machines'),
      services: this.http.get<HomelabService[]>('/api/services'),
    })
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: ({ vms, services }) => {
          const dashboard = toDashboardViewModel(vms, services);

          this.vms.set(dashboard.vms);
          this.unassignedServices.set(dashboard.unassignedServices);
          this.error.set(null);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Could not load VMs and services.');
          this.isLoading.set(false);
        },
      });
  }
}

function toDashboardViewModel(vms: HomelabMachine[], services: HomelabService[]) {
  const machineIds = new Set(vms.map((vm) => vm.id));
  const servicesByMachineId = new Map<string, HomelabService[]>();

  for (const service of services) {
    if (!service.machineId || !machineIds.has(service.machineId)) {
      continue;
    }

    servicesByMachineId.set(service.machineId, [...(servicesByMachineId.get(service.machineId) ?? []), service]);
  }

  return {
    vms: vms.map((vm) => {
      const services = (servicesByMachineId.get(vm.id) ?? []).map(toServiceViewModel);

      return {
        id: vm.id,
        name: vm.name,
        status: vm.status ? toStatus(vm.status) : toVmStatusFromServices(services),
        services,
      };
    }),
    unassignedServices: services
      .filter((service) => !service.machineId || !machineIds.has(service.machineId))
      .map(toServiceViewModel),
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
