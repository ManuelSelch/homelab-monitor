import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { AppShell } from './components/app-shell/app-shell';
import { ServiceCard } from './components/service-card/service-card';
import { UiStack } from './ui/stack/stack';
import { UiText } from './ui/text/text';

type HomelabService = {
  id: string;
  name: string;
  status: string;
  vmId: string;
  type?: string;
  url?: string;
};

type ServiceStatus = 'Online' | 'Offline' | 'Warning';

type ServiceViewModel = {
  id: string;
  name: string;
  type: string;
  status: ServiceStatus;
  url?: string;
};

@Component({
  imports: [RouterOutlet, AppShell, ServiceCard, UiStack, UiText],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  private readonly http = inject(HttpClient);

  protected readonly isLoading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly services = signal<ServiceViewModel[]>([]);
  protected readonly hasServices = computed(() => this.services().length > 0);

  constructor() {
    this.http
      .get<HomelabService[]>('/api/services')
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (services) => {
          this.services.set(services.map(toServiceViewModel));
          this.error.set(null);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Could not load services.');
          this.isLoading.set(false);
        },
      });
  }
}

function toServiceViewModel(service: HomelabService): ServiceViewModel {
  return {
    id: service.id,
    name: service.name,
    type: service.type ?? 'Service',
    status: toServiceStatus(service.status),
    url: service.url,
  };
}

function toServiceStatus(status: string): ServiceStatus {
  switch (status.toLowerCase()) {
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
