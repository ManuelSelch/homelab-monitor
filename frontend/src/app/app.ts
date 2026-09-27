import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppShell } from './components/app-shell/app-shell';
import { ServiceCard } from './components/service-card/service-card';

@Component({
  imports: [RouterOutlet, AppShell, ServiceCard],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
