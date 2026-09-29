import { Component } from '@angular/core';

@Component({
  selector: 'ui-center',
  template: `<ng-content />`,
  host: { 'class': 'flex items-center justify-center' }
})
export class UiCenter {}
