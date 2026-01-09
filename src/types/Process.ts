export type ProcessStatus = "up" | "down";

export type Process = {
  name: string;
  host: string;
  port: number;
  status: ProcessStatus;
  pid: number | null;
  mem: string | null;

  // ✅ optional backend fields (for better UI)
  goal?: string | null;       // "up" | "down" | "" | null
  attempts?: number | null;   // retries count
  laststart?: string | null;
  lastheartbeat?: string | null;
};