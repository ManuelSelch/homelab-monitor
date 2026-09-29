import { Component, computed, input } from '@angular/core';
import {
  boxClasses,
  type UiBorder,
  type UiPadding,
  type UiRadius,
  type UiVariant,
  type UiWidth,
} from '../shared/box-classes';

@Component({
  selector: 'ui-box',
  template: `<div [class]="classes()"><ng-content /></div>`,
})
export class UiBox {
  variant = input<UiVariant>('plain');
  padding = input<UiPadding>('none');
  border = input<UiBorder>('none');
  radius = input<UiRadius>('none');
  width = input<UiWidth>('auto');

  classes = computed(() =>
    boxClasses({
      variant: this.variant(),
      padding: this.padding(),
      border: this.border(),
      radius: this.radius(),
      width: this.width(),
    }),
  );
}
