import { Component, computed, input } from '@angular/core';

type TitleSize = 'sm' | 'md' | 'lg' | 'xl';

type TitleOrder = 1 | 2 | 3 | 4;

@Component({
  selector: 'ui-title',
  template: `<h1 [class]="classes()"><ng-content /></h1>`,
})
export class UiTitle {
  size = input<TitleSize>('md');

  classes = computed(() => {
    const sizes: Record<TitleSize, string> = {
      sm: 'text-base',
      md: 'text-lg',
      lg: 'text-2xl',
      xl: 'text-3xl',
    };

    return `${sizes[this.size()]} font-semibold tracking-tight`;
  });
}
