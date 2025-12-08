// src/types/Process.ts
export type ProcessStatus = "up" | "down";

export type Process = {
  name: string;
  host: string;
  port: number;
  status: ProcessStatus;
  pid: number | null;
  mem: string | null;
};
