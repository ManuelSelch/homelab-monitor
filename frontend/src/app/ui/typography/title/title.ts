import { Component, computed, input } from '@angular/core';
import { TextVariant } from '../text/text';

type TitleSize = 'sm' | 'md' | 'lg' | 'xl';

type TitleOrder = 1 | 2 | 3 | 4;

@Component({
  selector: 'ui-title',
  template: `<h1 [class]="classes()"><ng-content /></h1>`,
})
export class UiTitle {
  size = input<TitleSize>('md');
  variant = input<TextVariant>('default');
  
  classes = computed(() => {
    const sizes: Record<TitleSize, string> = {
      sm: 'text-base',
      md: 'text-lg',
      lg: 'text-2xl',
      xl: 'text-3xl',
    };

    const variants: Record<TextVariant, string> = {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      danger: 'text-red-600',
      warning: 'text-yellow-600',
      success: 'text-green-600',
    };

    return `${sizes[this.size()]} ${variants[this.variant()]} font-semibold tracking-tight`;
  });
}
