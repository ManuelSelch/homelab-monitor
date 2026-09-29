import { Component, computed, input } from '@angular/core';
import {
  boxClasses,
  type UiBorder,
  type UiPadding,
  type UiPreset,
  type UiRadius,
  type UiVariant,
  type UiWidth,
} from '../shared/box-classes';

@Component({
  selector: 'ui-box',
  template: `<div [class]="classes()"><ng-content /></div>`,
})
export class UiBox {
  preset = input<UiPreset>('plain');
  variant = input<UiVariant | undefined>();
  padding = input<UiPadding | undefined>();
  border = input<UiBorder | undefined>();
  radius = input<UiRadius | undefined>();
  width = input<UiWidth | undefined>();

  classes = computed(() =>
    boxClasses({
      preset: this.preset(),
      variant: this.variant(),
      padding: this.padding(),
      border: this.border(),
      radius: this.radius(),
      width: this.width(),
    }),
  );
}
