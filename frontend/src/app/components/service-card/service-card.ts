import { Component, input } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { BadgeVariant, UiBadge } from '../../ui/badge/badge';
import { UiHStack } from '../../ui/hstack/hstack';
import { UiText } from '../../ui/text/text';
import { UiTitle } from '../../ui/title/title';

@Component({
  imports: [HlmCardImports, UiBadge, UiHStack, UiText, UiTitle],
  selector: 'app-service-card',
  templateUrl: './service-card.html',
})
export class ServiceCard {
  name = input.required<string>();
  type = input.required<string>();
  status = input.required<'Online' | 'Offline' | 'Warning'>();
  url = input<string>();

  badge(): BadgeVariant {
    switch(this.status()) {
      case 'Online':  return 'success';
      case 'Warning': return 'warning';
      case 'Offline': return 'danger';
    }
  }
}
