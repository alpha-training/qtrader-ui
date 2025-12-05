import type { IWebSocketClient } from "./IWebSocketClient";
import { wsRouter } from "./wsRouter";
import { useWsStore } from "../store/wsStore";
import { config } from "../config";

class RealWsClient implements IWebSocketClient {
  ws: WebSocket | null = null;
  reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  manualClose = false;

  connect() {
    if (this.ws) return;

    useWsStore.getState().setConnecting();
    console.log("WS: connecting →", config.wsUrl);

    this.ws = new WebSocket(config.wsUrl);

    this.ws.onopen = () => {
      console.log("WS: connected");
      useWsStore.getState().setConnected();
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        wsRouter(msg);
      } catch (err) {
        console.warn("WS message parse error", err);
      }
    };

    this.ws.onclose = () => {
      if (this.manualClose) return;

      console.log("WS: closed → reconnecting...");
      useWsStore.getState().setReconnecting();

      this.reconnectTimer = setTimeout(() => {
        this.ws = null;
        this.connect();
      }, 1500);
    };
  }

  close() {
    this.manualClose = true;
    try {
      this.ws?.close();
    } catch {}
    useWsStore.getState().setClosed();
  }
}

export const realWsClient = new RealWsClient();
