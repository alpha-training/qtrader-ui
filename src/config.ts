// src/config.ts
export const config = {
  apiMode: import.meta.env.VITE_API_MODE ?? "mock",
  wsUrl: import.meta.env.VITE_WS_URL ?? "ws://localhost:3001/ws",
  apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
};

console.log("[CONFIG]", config);
