import { Component, computed, input } from '@angular/core';

type TitleSize = 'sm' | 'md' | 'lg' | 'xl';

type TitleOrder = 1 | 2 | 3 | 4;

@Component({
  selector: 'ui-title',
  template: `
    @switch (order()) {
      @case (1) { <h1 [class]="classes()"><ng-content /></h1> }
      @case (2) { <h2 [class]="classes()"><ng-content /></h2> }
      @case (3) { <h3 [class]="classes()"><ng-content /></h3> }
      @case (4) { <h4 [class]="classes()"><ng-content /></h4> }
    }
  `,
})
export class UiTitle {
  order = input<TitleOrder>(1);
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
