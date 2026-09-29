import { Status } from "./status";

export type Machine = {
  id: string;
  name: string;
  status: Status;
  cpuUsage: number;
  memoryUsage: number;
};