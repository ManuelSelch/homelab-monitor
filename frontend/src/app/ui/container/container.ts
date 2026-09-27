import { Component, computed, input } from '@angular/core';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'ui-container',
  template: `<div [class]="classes()"><ng-content /></div>`,
})
export class UiContainer {
  size = input<ContainerSize>('lg');

  classes = computed(() => {
    const sizes: Record<ContainerSize, string> = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
    };

    return `mx-auto w-full px-6 ${sizes[this.size()]}`;
  });
}
