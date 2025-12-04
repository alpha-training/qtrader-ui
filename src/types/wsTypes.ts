// src/types/wsTypes.ts

// WebSocket update for process status
export type WSProcessUpdate = {
    type: "process.update";
    name: string;
    status: "up" | "down";
    pid?: number | null;
    mem?: string | null;
  };
  
  // WebSocket log entry
  export type WSLogEntry = {
    type: "log.entry";
    timestamp: string;
    level: "INFO" | "ERROR";
    message: string;
    channel: string;
  };
  
  // Combined WS message
  export type WSMessage = WSProcessUpdate | WSLogEntry;
  