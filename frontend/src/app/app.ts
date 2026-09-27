import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppShell } from './components/app-shell/app-shell';
import { ServiceCard } from './components/service-card/service-card';
import { UiStack } from './ui/stack/stack';

@Component({
  imports: [RouterOutlet, AppShell, ServiceCard, UiStack],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
