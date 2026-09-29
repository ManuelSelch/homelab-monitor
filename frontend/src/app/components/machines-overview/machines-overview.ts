import { Component, input, output } from '@angular/core';
import { MachineWithServices } from '../../domain/dashboard';
import { UiStack } from '../../ui/layout/stack/stack';
import { UiTitle } from '../../ui/title/title';
import { badgeForStatus } from '../../ui/badge/badge';
import { MachineCard } from '../machine-card/machine-card';
import { UiBox } from '../../ui/layout/box/box';
@Component({
  imports: [UiStack, UiTitle, MachineCard, UiBox],
  selector: 'app-machines-overview',
  templateUrl: './machines-overview.html',
})
export class MachinesOverview {
  machines = input.required<MachineWithServices[]>();
  currentMachine = input<string>();

  machineSelected = output<string>();

  selectMachine(machineId: string) {
    this.machineSelected.emit(machineId);
  }

  protected badgeForStatus = badgeForStatus;
}
