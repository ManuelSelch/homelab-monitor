import { Component, input } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { BadgeVariant, UiBadge } from '../../ui/badge/badge';
import { UiStack } from '../../ui/stack/stack';
import { UiText } from '../../ui/text/text';
import { UiTitle } from '../../ui/title/title';
import { ServiceCard } from '../service-card/service-card';

export type VmStatus = 'Online' | 'Offline' | 'Warning';

export type VmService = {
  id: string;
  name: string;
  type: string;
  status: VmStatus;
  url?: string;
};

export type VmWithServices = {
  id: string;
  name: string;
  status: VmStatus;
  services: VmService[];
};

@Component({
  imports: [HlmCardImports, ServiceCard, UiBadge, UiStack, UiText, UiTitle],
  selector: 'app-vm-card',
  templateUrl: './vm-card.html',
})
export class VmCard {
  vm = input.required<VmWithServices>();

  badge(): BadgeVariant {
    switch (this.vm().status) {
      case 'Online':
        return 'success';
      case 'Warning':
        return 'warning';
      case 'Offline':
        return 'danger';
    }
  }
}
