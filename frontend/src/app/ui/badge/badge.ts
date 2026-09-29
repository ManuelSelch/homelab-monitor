import { Component, computed, input } from '@angular/core';
import { Status } from '../../domain/machine';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'muted';

export function badgeForStatus(status: Status): BadgeVariant {
  switch (status) {
    case 'online':
      return 'success';
    case 'warning':
      return 'warning';
    case 'offline':
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
