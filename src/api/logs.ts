// src/api/logs.ts
export type LogRecord = {
    timestamp: string;
    level: "INFO" | "ERROR";
    message: string;
    channel: string;
  };
  
  // mock logs
  export const mockLogs: LogRecord[] = [
    { timestamp: "09:12:14", level: "INFO", message: "heartbeat ok", channel: "rdb1" },
    { timestamp: "09:12:15", level: "INFO", message: "market snapshot received", channel: "pxfeed" },
    { timestamp: "09:12:16", level: "ERROR", message: "connection timeout to CME", channel: "tp2" },
    { timestamp: "09:12:17", level: "INFO", message: "writing batch", channel: "hdb1" },
  ];
  
  // REST load logs (with fallback)
  export async function fetchLogsAPI(): Promise<LogRecord[] | null> {
    try {
      const res = await fetch("http://localhost:3000/api/logs");
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      console.warn("API offline → using mock logs");
      return mockLogs;
    }
  }
  
  // WebSocket streaming (when backend ready)
  export function subscribeLogsWS(onMessage: (log: LogRecord) => void) {
    try {
      const ws = new WebSocket("ws://localhost:3000/logs");
  
      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        onMessage(data);
      };
  
      return () => ws.close();
    } catch {
      console.warn("WebSocket unavailable, running without streaming");
      return () => {};
    }
  }
  