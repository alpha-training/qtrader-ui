// src/api/client.ts
import { config } from "../config";
export const API_BASE = config.apiUrl;

export async function apiGet(path: string) {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (err) {
    console.warn("⚠ API offline — using mock data");
    throw err;
  }
}

export async function apiPost(path: string, body: any = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (err) {
    console.warn("⚠ API offline — using mock data");
    throw err;
  }
}
