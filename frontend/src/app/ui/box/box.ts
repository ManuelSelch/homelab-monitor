import { Component, computed, input } from '@angular/core';

type BoxVariant = 'plain' | 'page' | 'surface' | 'muted';
type BoxPadding = 'none' | 'sm' | 'md' | 'lg';
type BoxBorder = 'none' | 'top' | 'bottom' | 'all';

@Component({
  selector: 'ui-box',
  template: `<div [class]="classes()"><ng-content /></div>`,
})
export class UiBox {
  variant = input<BoxVariant>('plain');
  padding = input<BoxPadding>('none');
  border = input<BoxBorder>('none');

  classes = computed(() => {
    const variants: Record<BoxVariant, string> = {
      plain: '',
      page: 'min-h-dvh bg-background text-foreground',
      surface: 'bg-card text-card-foreground',
      muted: 'bg-muted text-muted-foreground',
    };

    const paddings: Record<BoxPadding, string> = {
      none: '',
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-8',
    };

    const borders: Record<BoxBorder, string> = {
      none: '',
      top: 'border-t',
      bottom: 'border-b',
      all: 'border',
    };

    return [variants[this.variant()], paddings[this.padding()], borders[this.border()]]
      .filter(Boolean)
      .join(' ');
  });
}
