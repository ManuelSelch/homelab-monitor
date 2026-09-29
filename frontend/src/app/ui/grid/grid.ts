import { booleanAttribute, Component, computed, input } from '@angular/core';

type GridPreset = 'default';
type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg';
type GridColumns = '1' | '2' | '3' | '4';

@Component({
  selector: 'ui-grid',
  template: `<div [class]="classes()"><ng-content /></div>`,
})
export class UiGrid {
  preset = input<GridPreset>('default');
  responsive = input(true, { transform: booleanAttribute });
  gap = input<GridGap | undefined>();
  columns = input<GridColumns | undefined>();

  classes = computed(() => {
    const presets: Record<GridPreset, string> = {
      default: 'grid gap-3',
    };

    const gaps: Record<GridGap, string> = {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-3',
      md: 'gap-4',
      lg: 'gap-6',
    };

    return [
      presets[this.preset()],
      this.gap() ? gaps[this.gap()!] : '',
      this.columns() ? this.columnClasses(this.columns()!, this.responsive()) : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  private columnClasses(columns: GridColumns, responsive: boolean): string {
    if (!responsive) {
      const fixedColumns: Record<GridColumns, string> = {
        '1': 'grid-cols-1',
        '2': 'grid-cols-2',
        '3': 'grid-cols-3',
        '4': 'grid-cols-4',
      };

      return fixedColumns[columns];
    }

    const responsiveColumns: Record<GridColumns, string> = {
      '1': 'grid-cols-1',
      '2': 'grid-cols-1 md:grid-cols-2',
      '3': 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
      '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    };

    return responsiveColumns[columns];
  }
}
