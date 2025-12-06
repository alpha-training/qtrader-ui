// src/ws/wsProvider.ts
import { wsRouter } from "./wsRouter";
import { useWsStore } from "../store/wsStore";
import { useLogsStore } from "../store/logsStore";
import type { LogEntry } from "../types/LogEntry";

/**
 * WebSocket client with:
 * - auto reconnect (exponential backoff)
 * - heartbeat ping/pong
 * - timeout detection
 * - process_start / process_stop WS support
 * - auto-resubscribe after reconnect
 * - buffered log handling for high-performance log streaming
 */
class WsProvider {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;

  private heartbeatInterval: number | undefined;
  private heartbeatTimeout: number | undefined;

  // ⭐ NEW: buffering
  private logBuffer: LogEntry[] = [];
  private flushTimer: number | null = null;
  private readonly BUFFER_FLUSH_MS = 80; // adjust for performance

  private readonly HEARTBEAT_MS = 5000;  // send ping every 5s
  private readonly TIMEOUT_MS = 10000;   // if no pong in 10s → dead

  private readonly WS_URL =
    import.meta.env.VITE_WS_URL || "ws://localhost:9001/ws";

  // --------------------------------------------------
  // Buffer logs and flush in batches
  // --------------------------------------------------
  bufferLog(log: LogEntry) {
    this.logBuffer.push(log);

    // Start timer if not active
    if (!this.flushTimer) {
      this.flushTimer = window.setTimeout(
        () => this.flushLogBuffer(),
        this.BUFFER_FLUSH_MS
      );
    }
  }

  private flushLogBuffer() {
    if (this.logBuffer.length > 0) {
      const batch = [...this.logBuffer];
      this.logBuffer = [];

      useLogsStore.getState().pushMany(batch);
    }

    this.flushTimer = null;
  }

  // ---------------------------------------
  // PUBLIC: start WS connection
  // ---------------------------------------
  connect() {
    this.cleanup();

    useWsStore.getState().setConnecting();
    this.ws = new WebSocket(this.WS_URL);

    this.ws.onopen = () => this.handleOpen();
    this.ws.onmessage = (ev) => this.handleMessage(ev);
    this.ws.onerror = () => this.handleError();
    this.ws.onclose = () => this.handleClose();
  }

  private handleOpen() {
    console.log("[WS] connected");
    useWsStore.getState().setConnected();

    this.reconnectAttempts = 0;

    this.send({ event: "subscribe_all" });
    this.startHeartbeat();
  }

  private handleMessage(event: MessageEvent) {
    // raw text pong
    if (event.data === "pong") {
      this.resetHeartbeatTimeout();
      return;
    }

    // JSON pong
    try {
      const parsed = JSON.parse(event.data);
      if (parsed.event === "pong") {
        this.resetHeartbeatTimeout();
        return;
      }
    } catch {
      // non-JSON message → handled by router below
    }

    wsRouter(event.data);
  }

  private handleError() {
    console.warn("[WS] error");
  }

  private handleClose() {
    console.warn("[WS] connection closed");

    useWsStore.getState().setClosed();
    this.stopHeartbeat();
    this.scheduleReconnect();
  }

  // ---------------------------------------
  // HEARTBEAT
  // ---------------------------------------
  private startHeartbeat() {
    // reset any existing timers
    this.stopHeartbeat();

    this.heartbeatInterval = window.setInterval(() => {
      this.send({ event: "ping" });
      this.startHeartbeatTimeout();
    }, this.HEARTBEAT_MS);
  }

  private startHeartbeatTimeout() {
    this.clearHeartbeatTimeout();

    this.heartbeatTimeout = window.setTimeout(() => {
      console.error("[WS] heartbeat timeout — server not responding");

      useWsStore.getState().setClosed();
      // force reconnect by closing socket
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

  // ---------------------------------------
  // RECONNECT
  // ---------------------------------------
  private scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = Math.min(5000, 500 * Math.pow(1.5, this.reconnectAttempts));

    console.log(`[WS] reconnecting in ${delay}ms`);
    useWsStore.getState().setReconnecting();

    setTimeout(() => this.connect(), delay);
  }

  // ---------------------------------------
  // SEND
  // ---------------------------------------
  send(data: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn("[WS] send ignored, socket not open", data);
      return;
    }
    this.ws.send(typeof data === "string" ? data : JSON.stringify(data));
  }

  // ---------------------------------------
  // PUBLIC API: process control
  // ---------------------------------------
  processStart(name: string) {
    this.send({ event: "process_start", process: name });
  }

  processStop(name: string) {
    this.send({ event: "process_stop", process: name });
  }

  // ---------------------------------------
  // PUBLIC: request older logs (pagination)
  // ---------------------------------------
  requestLogsPage(beforeTimestamp?: string) {
    this.send({
      event: "logs_request_page",
      before: beforeTimestamp ?? null,
    });
  }

  // ---------------------------------------
  // CLEANUP
  // ---------------------------------------
  private cleanup() {
    this.stopHeartbeat();

    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      this.ws.onclose = null;
    }
  }
}

export const wsClient = new WsProvider();
