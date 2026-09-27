import { booleanAttribute, Component, computed, input } from '@angular/core';

type LinkVariant = 'default' | 'muted';

@Component({
  selector: 'ui-link',
  template: `
    <a
      [class]="classes()"
      [href]="href()"
      [target]="external() ? '_blank' : null"
      [rel]="external() ? 'noopener noreferrer' : null"
    >
      <ng-content />
    </a>
  `,
})
export class UiLink {
  href = input.required<string>();
  external = input(false, { transform: booleanAttribute });
  variant = input<LinkVariant>('default');

  classes = computed(() => {
    const variants: Record<LinkVariant, string> = {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
    };

    return `text-sm font-medium underline-offset-4 hover:underline ${variants[this.variant()]}`;
  });
}
