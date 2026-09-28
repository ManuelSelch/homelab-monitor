import { Component, input, output } from '@angular/core';
import { MachineWithServices } from '../../domain/dashboard';
import { UiStack } from '../../ui/stack/stack';
import { UiTitle } from '../../ui/title/title';
import { UiText } from '../../ui/text/text';
import { badgeForStatus, UiBadge } from '../../ui/badge/badge';

@Component({
  imports: [UiStack, UiTitle, UiText, UiBadge],
  selector: 'app-machines-overview',
  templateUrl: './machines-overview.html',
})
export class MachinesOverview {
  machines = input.required<MachineWithServices[]>();

  machineSelected = output<string>();

  selectMachine(machineId: string) {
    this.machineSelected.emit(machineId);
  }


  protected badgeForStatus = badgeForStatus;
}
