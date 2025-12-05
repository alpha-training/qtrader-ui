// src/types/LogEntry.ts
export type LogLevel = "INFO" | "ERROR";

export type LogEntry = {
  timestamp: string;
  level: string;
  channel: string;
  message: string;
  type?: string;  
};