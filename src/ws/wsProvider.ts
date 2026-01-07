// src/ws/wsProvider.ts
import { wsRouter } from "./wsRouter";
import { useWsStore } from "../store/wsStore";
import { useLogsStore } from "../store/logsStore";
import type { LogEntry } from "../types/LogEntry";

class WsProvider {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;

  private isConnecting = false; // prevent double connect
  private hasConnectedOnce = false;

  private heartbeatInterval: number | undefined;
  private heartbeatTimeout: number | undefined;

  private logBuffer: LogEntry[] = [];
  private flushTimer: number | null = null;

  private readonly BUFFER_FLUSH_MS = 80;
  private readonly HEARTBEAT_MS = 5000;
  private readonly TIMEOUT_MS = 10000;

  private readonly WS_URL =
    import.meta.env.VITE_WS_URL || "ws://localhost:9001/ws";

  // ✅ NEW: allow disabling WS completely via env
  // Set in .env/.env.development:
  // VITE_WS_ENABLED=false
  private readonly WS_ENABLED =
    String(import.meta.env.VITE_WS_ENABLED ?? "true") !== "false";

  // --------------------------------------------------
  // LOG BUFFER
  // --------------------------------------------------
  bufferLog(log: LogEntry) {
    this.logBuffer.push(log);

    if (!this.flushTimer) {
      this.flushTimer = window.setTimeout(
        () => this.flushLogBuffer(),
        this.BUFFER_FLUSH_MS
      );
    }
  }

  private flushLogBuffer() {
    if (this.logBuffer.length > 0) {
      useLogsStore.getState().pushMany([...this.logBuffer]);
      this.logBuffer = [];
    }
    this.flushTimer = null;
  }

  // --------------------------------------------------
  // CONNECT — optional + safe
  // --------------------------------------------------
  connect() {
    // ✅ If WS disabled, keep app quiet and mark WS as closed (not reconnecting)
    if (!this.WS_ENABLED) {
      this.isConnecting = false;
      this.cleanup();
      useWsStore.getState().setClosed();
      console.info("[WS] disabled (VITE_WS_ENABLED=false)");
      return;
    }

    if (this.isConnecting) {
      console.warn("[WS] connect() ignored — already connecting");
      return;
    }

    this.isConnecting = true;

    // Full cleanup before new connection
    this.cleanup();

    useWsStore.getState().setConnecting();
    console.log("[WS] connecting…", this.WS_URL);

    try {
      this.ws = new WebSocket(this.WS_URL);
    } catch (e) {
      this.isConnecting = false;
      console.error("[WS] failed to construct WebSocket:", e);
      useWsStore.getState().setClosed();
      return;
    }

    this.ws.onopen = () => this.handleOpen();
    this.ws.onmessage = (ev) => this.handleMessage(ev);
    this.ws.onerror = () => this.handleError();
    this.ws.onclose = () => this.handleClose();
  }

  private handleOpen() {
    this.isConnecting = false;
    this.hasConnectedOnce = true;

    console.log("[WS] connected");
    useWsStore.getState().setConnected();

    this.reconnectAttempts = 0;

    this.send({ event: "subscribe_all" });
    this.startHeartbeat();
  }

  private handleMessage(event: MessageEvent) {
    const data = event.data;

    if (data === "pong") {
      this.resetHeartbeatTimeout();
      return;
    }

    try {
      const parsed = JSON.parse(data);
      if (parsed?.event === "pong") {
        this.resetHeartbeatTimeout();
        return;
      }
    } catch {
      /* ignore */
    }

    wsRouter(data);
  }

  private handleError() {
    console.warn("[WS] error");
    // Don't force reconnect here; onclose will schedule it.
  }

  private handleClose() {
    this.isConnecting = false;
    console.warn("[WS] connection closed");

    useWsStore.getState().setClosed();
    this.stopHeartbeat();

    // ✅ If WS disabled, never reconnect
    if (!this.WS_ENABLED) return;

    this.scheduleReconnect();
  }

  // --------------------------------------------------
  // HEARTBEAT
  // --------------------------------------------------
  private startHeartbeat() {
    this.stopHeartbeat();

    this.heartbeatInterval = window.setInterval(() => {
      this.send({ event: "ping" });
      this.startHeartbeatTimeout();
    }, this.HEARTBEAT_MS);
  }

  private startHeartbeatTimeout() {
    this.clearHeartbeatTimeout();

    this.heartbeatTimeout = window.setTimeout(() => {
      console.error("[WS] heartbeat timeout");
      useWsStore.getState().setClosed();
      this.ws?.close();
    }, this.TIMEOUT_MS);
  }

  private resetHeartbeatTimeout() {
    this.clearHeartbeatTimeout();
  }

  private clearHeartbeatTimeout() {
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = undefined;
    }
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
    }
    this.clearHeartbeatTimeout();
  }

  // --------------------------------------------------
  // RECONNECT
  // --------------------------------------------------
  private scheduleReconnect() {
    // ✅ If WS disabled, never reconnect
    if (!this.WS_ENABLED) return;

    this.reconnectAttempts++;
    const delay = Math.min(5000, 500 * Math.pow(1.5, this.reconnectAttempts));

    console.log(`[WS] reconnecting in ${delay}ms`);
    useWsStore.getState().setReconnecting();

    setTimeout(() => this.connect(), delay);
  }

  // --------------------------------------------------
  // SEND
  // --------------------------------------------------
  send(data: any) {
    // ✅ If WS disabled, do nothing quietly
    if (!this.WS_ENABLED) return;

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return console.warn("[WS] send() ignored — socket not open");
    }

    this.ws.send(typeof data === "string" ? data : JSON.stringify(data));
  }

  // --------------------------------------------------
  // PUBLIC API
  // --------------------------------------------------
  processStart(name: string) {
    this.send({ event: "process_start", process: name });
  }

  processStop(name: string) {
    this.send({ event: "process_stop", process: name });
  }

  requestLogsPage(beforeTimestamp?: string) {
    this.send({
      event: "logs_request_page",
      before: beforeTimestamp ?? null,
    });
  }

  // --------------------------------------------------
  // CLEANUP — prevents duplicate listeners
  // --------------------------------------------------
  private cleanup() {
    this.stopHeartbeat();

    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      this.ws.onclose = null;

      try {
        this.ws.close();
      } catch {}

      this.ws = null;
    }
  }
}

export const wsClient = new WsProvider();
