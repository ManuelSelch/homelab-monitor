import { Component, input } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  imports: [HlmCardImports],
  selector: 'app-service-card',
  templateUrl: './service-card.html',
})
export class ServiceCard {
  name = input.required<string>();
  type = input.required<string>();
  status = input.required<'Online' | 'Offline' | 'Warning'>();
  url = input<string>();
}
