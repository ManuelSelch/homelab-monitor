import { Component, computed, input } from '@angular/core';

type StackSize = 'xs' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-stack',
  template: `<div [class]="classes()"><ng-content /></div>`,
})
export class UiStack {
  size = input<StackSize>('md');

  classes = computed(() => {
    const gaps: Record<StackSize, string> = {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
    };

    return `flex flex-col ${gaps[this.size()]}`;
  });
}
