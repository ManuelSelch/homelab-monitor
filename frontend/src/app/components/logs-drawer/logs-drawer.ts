import { Component, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { UiTitle } from '../../ui/typography/title/title';
import { UiText } from '../../ui/typography/text/text';
import { badgeForStatus, UiBadge } from '../../ui/badge/badge';
import { DashboardService } from '../../domain/dashboard';
import { HomelabApi } from '../../api/homelab-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [UiTitle, UiText, UiBadge],
  selector: 'app-logs-drawer',
  templateUrl: './logs-drawer.html',
})
export class LogsDrawer {
  service = input.required<DashboardService | null>();

  logsClosed = output();

  private readonly homelabApi = inject(HomelabApi);
  private readonly destroyRef = inject(DestroyRef);
  
  protected readonly logs = signal('');
  protected readonly logsLoading = signal(false);
  protected readonly logsError = signal<string | null>(null);

  constructor() {
    effect(() => {
      if(!this.service()) return;
      this.refreshLogs();
    })
  }

  protected badgeForStatus = badgeForStatus;

  protected refreshLogs(): void {
    const service = this.service();

    if (service) {
      this.loadLogs(service.id);
    }
  }

  protected closeLogs(): void {
    this.logs.set('');
    this.logsError.set(null);
    this.logsLoading.set(false);
    this.logsClosed.emit();
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
}
