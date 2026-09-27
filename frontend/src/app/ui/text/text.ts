import { Component, computed, input } from '@angular/core';

type TextSize = 'xs' | 'sm' | 'md' | 'lg';
type TextVariant = 'default' | 'muted';

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
    };

    return `${sizes[this.size()]} ${variants[this.variant()]}`;
  });
}
