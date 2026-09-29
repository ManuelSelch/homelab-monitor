import { Component, computed, input } from '@angular/core';

type HStackSize = 'xs' | 'sm' | 'md' | 'lg';
type HStackAlign = 'start' | 'center' | 'end';
type HStackJustify = 'start' | 'center' | 'between' | 'end';

@Component({
  selector: 'ui-hstack',
  template: `<ng-content />`,
  host: { '[class]': 'classes()' }
})
export class UiHStack {
  size = input<HStackSize>('md');
  align = input<HStackAlign>('center');
  justify = input<HStackJustify>('start');

  classes = computed(() => {
    const gaps: Record<HStackSize, string> = {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
    };

    const aligns: Record<HStackAlign, string> = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
    };

    const justifies: Record<HStackJustify, string> = {
      start: 'justify-start',
      center: 'justify-center',
      between: 'justify-between',
      end: 'justify-end',
    };

    return `flex ${gaps[this.size()]} ${aligns[this.align()]} ${justifies[this.justify()]}`;
  });
}
