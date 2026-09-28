import { MachineStatus } from './machine';

export type MonitoredServiceStatus = MachineStatus;

export type MonitoredService = {
  id: string;
  name: string;
  type: string;
  status: MonitoredServiceStatus;
  url?: string;
  machineId?: string;
};
