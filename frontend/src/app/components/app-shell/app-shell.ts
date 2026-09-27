import { Component, input } from '@angular/core';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.html',
})
export class AppShell {
  title = input.required<string>();
  subtitle = input.required<string>();
}
