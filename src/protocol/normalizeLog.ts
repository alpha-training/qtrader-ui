// src/protocol/normalizeLog.ts
import type { LogEntry } from "../types/LogEntry";

/**
 * Normalize backend log entry into FE LogEntry shape.
 * Works with unknown formats too.
 */
export function normalizeLog(raw: any): LogEntry {
  if (!raw) {
    return {
      timestamp: new Date().toISOString(),
      level: "INFO",
      channel: "system",
      message: "(empty log)",
    };
  }

  return {
    timestamp:
      raw.timestamp ??
      raw.ts ??
      raw.time ??
      new Date().toISOString(),

    level:
      raw.level ??
      raw.lvl ??
      raw.type ??
      "INFO",

    channel:
      raw.channel ??
      raw.process ??
      raw.src ??
      "system",

    message:
      raw.message ??
      raw.msg ??
      raw.text ??
      "",
  };
}
