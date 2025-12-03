// src/types/LogEntry.ts
export type LogLevel = "INFO" | "ERROR";

export type LogEntry = {
  timestamp: string;
  level: LogLevel;
  message: string;
  channel: string;
};
