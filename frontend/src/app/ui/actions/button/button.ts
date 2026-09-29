import { Directive, computed, input } from '@angular/core';
import {
  boxClasses,
  type UiBorder,
  type UiPadding,
  type UiRadius,
  type UiVariant,
  type UiWidth,
} from '../../shared/box-classes';

type ButtonAlign = 'center' | 'left';
type ButtonHover = 'none' | 'muted' | 'primary';
type ButtonPreset = 'default' | 'card' | 'primary' | 'secondary';

type ButtonOptions = {
  variant: UiVariant;
  padding: UiPadding;
  border: UiBorder;
  radius: UiRadius;
  width: UiWidth;
  align: ButtonAlign;
  hover: ButtonHover;
  extra: string;
};

const buttonPresets: Record<ButtonPreset, ButtonOptions> = {
  default: {
    variant: 'plain',
    padding: 'sm',
    border: 'none',
    radius: 'md',
    width: 'auto',
    align: 'center',
    hover: 'muted',
    extra: '',
  },
  card: {
    variant: 'surface',
    padding: 'sm',
    border: 'all',
    radius: 'xl',
    width: 'full',
    align: 'left',
    hover: 'primary',
    extra: '',
  },
  primary: {
    variant: 'plain',
    padding: 'sm',
    border: 'none',
    radius: 'md',
    width: 'auto',
    align: 'center',
    hover: 'none',
    extra: 'bg-primary text-primary-foreground hover:bg-primary/90',
  },
  secondary: {
    variant: 'muted',
    padding: 'sm',
    border: 'none',
    radius: 'md',
    width: 'auto',
    align: 'center',
    hover: 'muted',
    extra: '',
  }
};

@Directive({
  selector: 'button[uiButton]',
  host: {
    '[class]': 'classes()',
  },
})
export class UiButton {
  preset = input<ButtonPreset>('default');
  variant = input<UiVariant | undefined>();
  padding = input<UiPadding | undefined>();
  border = input<UiBorder | undefined>();
  radius = input<UiRadius | undefined>();
  width = input<UiWidth | undefined>();
  align = input<ButtonAlign | undefined>();
  hover = input<ButtonHover | undefined>();

  classes = computed(() => {
    const preset = buttonPresets[this.preset()];
    const align = this.align() ?? preset.align;
    const hover = this.hover() ?? preset.hover;

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
        variant: this.variant() ?? preset.variant,
        padding: this.padding() ?? preset.padding,
        border: this.border() ?? preset.border,
        radius: this.radius() ?? preset.radius,
        width: this.width() ?? preset.width,
      }),
      aligns[align],
      hovers[hover],
      preset.extra,
      'transition disabled:pointer-events-none disabled:opacity-50',
    ]
      .filter(Boolean)
      .join(' ');
  });
}
