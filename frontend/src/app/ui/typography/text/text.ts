import { Component, computed, input } from '@angular/core';

export type TextSize = 'xs' | 'sm' | 'md' | 'lg';
export type TextVariant = 'default' | 'muted' | 'danger' | 'warning' | 'success';

@Component({
  selector: 'ui-text',
  template: `<p [class]="classes()"><ng-content /></p>`,
})
export class UiText {
  size = input<TextSize>('md');
  variant = input<TextVariant>('default');

  classes = computed(() => {
    const sizes: Record<TextSize, string> = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    const variants: Record<TextVariant, string> = {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      danger: 'text-red-600',
      warning: 'text-yellow-600',
      success: 'text-green-600',
    };

    return `${sizes[this.size()]} ${variants[this.variant()]}`;
  });
}
