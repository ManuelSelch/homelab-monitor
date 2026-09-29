export type UiVariant = 'plain' | 'page' | 'surface' | 'muted';
export type UiPadding = 'none' | 'sm' | 'md' | 'lg';
export type UiBorder = 'none' | 'top' | 'bottom' | 'all';
export type UiRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type UiWidth = 'auto' | 'full';

export type BoxClassOptions = {
  variant: UiVariant;
  padding: UiPadding;
  border: UiBorder;
  radius: UiRadius;
  width?: UiWidth;
};

export function boxClasses(options: BoxClassOptions): string {
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
    variants[options.variant],
    paddings[options.padding],
    borders[options.border],
    radii[options.radius],
    widths[options.width ?? 'auto'],
  ]
    .filter(Boolean)
    .join(' ');
}
