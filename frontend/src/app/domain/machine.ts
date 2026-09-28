export type MachineStatus = 'Online' | 'Offline' | 'Warning';

export type Machine = {
  id: string;
  name: string;
  status: MachineStatus;
};
