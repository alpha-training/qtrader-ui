// src/types/wsTypes.ts
export type WSProcessUpdate = {
  type: "process_update";
  name: string;
  status: "up" | "down";
  pid: number | null;
  mem: string | null;
};

export type WSLogEntry = {
  type: "log_entry";
  timestamp: string;
  level: "INFO" | "ERROR";
  message: string;
  channel: string;
};
