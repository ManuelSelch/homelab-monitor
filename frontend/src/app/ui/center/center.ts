import { Component } from '@angular/core';

@Component({
  selector: 'ui-center',
  template: `<div class="flex items-center justify-center"><ng-content /></div>`,
})
export class UiCenter {}
