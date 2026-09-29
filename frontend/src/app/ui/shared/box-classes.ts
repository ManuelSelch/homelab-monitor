export type UiVariant = 'plain' | 'page' | 'surface' | 'muted';
export type UiPadding = 'none' | 'sm' | 'md' | 'lg';
export type UiBorder = 'none' | 'top' | 'bottom' | 'all';
export type UiRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type UiWidth = 'auto' | 'full';
export type UiPreset = 'plain' | 'page' | 'card' | 'section' | 'muted';

export type BoxClassOptions = {
  preset?: UiPreset;
  variant?: UiVariant;
  padding?: UiPadding;
  border?: UiBorder;
  radius?: UiRadius;
  width?: UiWidth;
};

type ResolvedBoxClassOptions = Required<Omit<BoxClassOptions, 'preset'>>;

const boxPresets: Record<UiPreset, ResolvedBoxClassOptions> = {
  plain: {
    variant: 'plain',
    padding: 'none',
    border: 'none',
    radius: 'none',
    width: 'auto',
  },
  page: {
    variant: 'page',
    padding: 'none',
    border: 'none',
    radius: 'none',
    width: 'auto',
  },
  card: {
    variant: 'surface',
    padding: 'sm',
    border: 'all',
    radius: 'xl',
    width: 'full',
  },
  section: {
    variant: 'surface',
    padding: 'md',
    border: 'all',
    radius: 'xl',
    width: 'full',
  },
  muted: {
    variant: 'muted',
    padding: 'sm',
    border: 'none',
    radius: 'lg',
    width: 'auto',
  },
};

export function resolveBoxOptions(options: BoxClassOptions = {}): ResolvedBoxClassOptions {
  const preset = boxPresets[options.preset ?? 'plain'];

  return {
    variant: options.variant ?? preset.variant,
    padding: options.padding ?? preset.padding,
    border: options.border ?? preset.border,
    radius: options.radius ?? preset.radius,
    width: options.width ?? preset.width,
  };
}

export function boxClasses(options: BoxClassOptions = {}): string {
  const resolved = resolveBoxOptions(options);

  const variants: Record<UiVariant, string> = {
    plain: '',
    page: 'min-h-dvh bg-background text-foreground',
    surface: 'bg-card text-card-foreground',
    muted: 'bg-muted text-muted-foreground',
  };

  const paddings: Record<UiPadding, string> = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  const borders: Record<UiBorder, string> = {
    none: '',
    top: 'border-t',
    bottom: 'border-b',
    all: 'border',
  };

  const radii: Record<UiRadius, string> = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  };

  const widths: Record<UiWidth, string> = {
    auto: '',
    full: 'w-full',
  };

  return [
    variants[resolved.variant],
    paddings[resolved.padding],
    borders[resolved.border],
    radii[resolved.radius],
    widths[resolved.width],
  ]
    .filter(Boolean)
    .join(' ');
}
