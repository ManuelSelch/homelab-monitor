import { Component, computed, input } from '@angular/core';
import { MachineStatus } from '../../domain/machine';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'muted';

export function badgeForStatus(status: MachineStatus): BadgeVariant {
  switch (status) {
    case 'Online':
      return 'success';
    case 'Warning':
      return 'warning';
    case 'Offline':
      return 'danger';
  }
}

@Component({
  selector: 'ui-badge',
  template: `<span [class]="classes()"><ng-content /></span>`,
})
export class UiBadge {
  variant = input<BadgeVariant>('default');

  classes = computed(() => {
    const variants: Record<BadgeVariant, string> = {
      default: 'bg-primary text-primary-foreground',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-700',
      muted: 'bg-muted text-muted-foreground',
    };

    return `inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${variants[this.variant()]}`;
  });
}
