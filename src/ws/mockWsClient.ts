// src/ws/mockWsClient.ts

import { useWsStore } from "../store/wsStore";
import { useLogsStore } from "../store/logsStore";
import { useProcessStore } from "../store/processStore";
import type { IWebSocketClient } from "./IWebSocketClient";

export class MockWSClient implements IWebSocketClient {
  ws: WebSocket | null = null;
  reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  manualClose = false;

  connect() {
    if (this.ws) return;

    console.log("WS: connecting (mock)...");
    useWsStore.getState().setConnecting();

    setTimeout(() => {
      console.log("WS: connected (mock)");
      useWsStore.getState().setConnected();
      this.startMockStreams();
    }, 1200);
  }

  startMockStreams() {
    // ----------------------------------------------------
    // LOG HEARTBEATS
    // ----------------------------------------------------
    setInterval(() => {
      useLogsStore.getState().pushLog({
        timestamp: new Date().toLocaleTimeString("en-GB"),
        level: "INFO",
        channel: "system",
        message: "WS heartbeat OK",
      });
    }, 3000);

    // ----------------------------------------------------
    // RANDOM PROCESS status flip
    // ----------------------------------------------------
    setInterval(() => {
      const processes = useProcessStore.getState().processes;
      if (!processes.length) return;
    
      const index = Math.floor(Math.random() * processes.length);
      const p = processes[index];
    
      const next = p.status === "up" ? "down" : "up";
    
      useProcessStore.getState().updateProcess({
        ...p,
        status: next,
      });
    }, 5000);
    
  }

  close() {
    this.manualClose = true;
    try {
      this.ws?.close();
    } catch {}
    useWsStore.getState().setClosed();
  }
}

export const mockWsClient = new MockWSClient();