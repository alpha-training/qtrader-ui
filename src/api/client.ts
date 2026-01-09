// src/api/client.ts
import { config } from "../config";
export const API_BASE = config.apiUrl;

export async function apiGet(path: string) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${url} -> ${res.status} ${text}`);
  }
  return res.json();
}

export async function apiPost(path: string, body: any = undefined) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`POST ${url} -> ${res.status} ${text}`);
  }
  return res.json();
}