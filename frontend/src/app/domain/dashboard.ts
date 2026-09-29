import { Machine } from './machine';
import { MonitoredService } from './monitored-service';

export type DashboardDataDto = {
  machines: Machine[];
  services: MonitoredService[];
};


export type MachineWithServices = Machine & {
  services: MonitoredService[];
};

export type DashboardService = MonitoredService & {
  machineName: string;
};

export type DashboardStats = {
  machines: number;
  services: number;
  warnings: number;
  offline: number;
};
