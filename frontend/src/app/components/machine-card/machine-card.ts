import { Component, computed, input, output } from '@angular/core';
import { badgeForStatus, UiBadge } from '../../ui/badge/badge';
import { TextVariant, UiText } from '../../ui/text/text';
import { MachineWithServices } from '../../domain/dashboard';
import { UiTitle } from '../../ui/title/title';
import { UiButton } from '../../ui/button/button';
import { UiHStack } from '../../ui/hstack/hstack';
import { UiStack } from '../../ui/stack/stack';

@Component({
  imports: [UiBadge, UiText, UiTitle, UiHStack, UiStack, UiButton],
  selector: 'app-machine-card',
  templateUrl: './machine-card.html',
})
export class MachineCard {
  machine = input.required<MachineWithServices>();
  isSelected = input.required<boolean>()

  machineClicked = output();

  protected cpuTextVariant = computed<TextVariant>(() => {
    var cpu = this.machine().cpuUsage;

    if(cpu >= 80) return 'danger'
    if(cpu >= 30) return 'warning'
    return 'muted'
  })

  clickMachine() {
    this.machineClicked.emit();
  }

  protected badgeForStatus = badgeForStatus;
}
