// src/api/logsApi.ts
import { mockApi } from "./mockApi";
import type { LogEntry } from "../types/LogEntry";
import { apiGet } from "./client";
import { config } from "../config";

function toText(resp: any): string {
  const tail = resp?.tail ?? resp;
  if (Array.isArray(tail)) return tail.join("\n");
  if (typeof tail === "string") return tail;
  return JSON.stringify(tail ?? "");
}

function textToEntries(channel: string, text: string): LogEntry[] {
  const lines = text
    .split("\n")
    .map((s) => s.trimEnd())
    .filter(Boolean);

  const now = new Date().toISOString();
  return lines.map((line) => ({
    timestamp: now,
    level: line.toLowerCase().includes("error") ? "ERROR" : "INFO",
    channel,
    message: line,
  }));
}

export const logsApi = {
  async getAll(): Promise<LogEntry[]> {
    if (config.apiMode !== "real") return mockApi.getLogs();

    // There is no GET /logs (only /logs/:name), so the live stream should be used.
    console.warn("[logsApi] getAll() not supported in real mode (no /logs endpoint). Using stream instead.");
    return [];
  },

  async getByChannel(ch: string): Promise<LogEntry[]> {
    if (config.apiMode !== "real") return mockApi.getLogsByChannel(ch);

    if (!ch || ch === "All") return [];
    const resp = await apiGet(`/logs/${encodeURIComponent(ch)}`);
    return textToEntries(ch, toText(resp));
  },
};
