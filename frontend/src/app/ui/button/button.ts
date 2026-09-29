import { Directive, computed, input } from '@angular/core';
import {
  boxClasses,
  type UiBorder,
  type UiPadding,
  type UiRadius,
  type UiVariant,
  type UiWidth,
} from '../shared/box-classes';

type ButtonAlign = 'center' | 'left';
type ButtonHover = 'none' | 'muted' | 'primary';

@Directive({
  selector: 'button[uiButton]',
  host: {
    '[class]': 'classes()',
  },
})
export class UiButton {
  variant = input<UiVariant>('plain');
  padding = input<UiPadding>('sm');
  border = input<UiBorder>('none');
  radius = input<UiRadius>('md');
  width = input<UiWidth>('auto');
  align = input<ButtonAlign>('center');
  hover = input<ButtonHover>('muted');

  classes = computed(() => {
    const aligns: Record<ButtonAlign, string> = {
      center: 'text-center',
      left: 'text-left',
    };

    const hovers: Record<ButtonHover, string> = {
      none: '',
      muted: 'hover:bg-muted/50',
      primary: 'hover:border-primary hover:bg-muted/50',
    };

    return [
      boxClasses({
        variant: this.variant(),
        padding: this.padding(),
        border: this.border(),
        radius: this.radius(),
        width: this.width(),
      }),
      aligns[this.align()],
      hovers[this.hover()],
      'transition disabled:pointer-events-none disabled:opacity-50',
    ]
      .filter(Boolean)
      .join(' ');
  });
}
