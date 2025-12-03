// src/api/client.ts
export const API_BASE = "http://localhost:3000/api";

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
