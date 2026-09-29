import { Component, input, output } from '@angular/core';
import { badgeForStatus, UiBadge } from '../../ui/badge/badge';
import { UiText } from '../../ui/text/text';
import { MachineWithServices } from '../../domain/dashboard';

@Component({
  imports: [UiBadge, UiText],
  selector: 'app-machine-card',
  templateUrl: './machine-card.html',
})
export class MachineCard {
  machine = input.required<MachineWithServices>();

  machineClicked = output();

  clickMachine() {
    this.machineClicked.emit();
  }

  protected badgeForStatus = badgeForStatus;
}
