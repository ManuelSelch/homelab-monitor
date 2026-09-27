import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServiceCard } from './components/service-card/service-card';

@Component({
  imports: [RouterOutlet, ServiceCard],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
