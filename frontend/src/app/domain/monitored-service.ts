import { Status } from "./status";

export type MonitoredService = {
  id: string;
  name: string;
  type: string;
  status: Status;
  url?: string;
  machineId?: string;
};