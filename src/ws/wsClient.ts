// src/ws/wsClient.ts
import { wsRouter } from "./wsRouter";

class WSClient {
  private ws: WebSocket | null = null;
  private reconnectTimer: any = null;

  private url = "ws://localhost:1234"; // placeholder

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("[WS] Connected");
    };

    this.ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        wsRouter(msg); // 🔥 all events now go through router
      } catch (e) {
        console.error("WS message parse error:", e);
      }
    };

    this.ws.onerror = () => {
      console.error("[WS] Error");
    };

    this.ws.onclose = () => {
      console.warn("[WS] Closed → reconnect in 1s");
      this.scheduleReconnect();
    };
  }

  scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 1000);
  }

  send(msg: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify(msg));
  }

  // For testing without backend:
  mockEmit(msg: any) {
    wsRouter(msg);
  }
}

export const wsClient = new WSClient();
