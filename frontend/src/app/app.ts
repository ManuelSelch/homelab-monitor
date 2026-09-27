import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  imports: [RouterOutlet, HlmCardImports],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
