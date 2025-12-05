import type { IWebSocketClient } from "./IWebSocketClient";
import { useWsStore } from "../store/wsStore";
import { useLogsStore } from "../store/logsStore";
import { useProcessStore } from "../store/processStore";

class MockWsClient implements IWebSocketClient {
  ws: null = null;
  reconnectTimer: null = null;
  manualClose = false;

  connect() {
    console.log("Mock WS: connecting...");
    useWsStore.getState().setConnecting();

    setTimeout(() => {
      console.log("Mock WS: connected");
      useWsStore.getState().setConnected();
      this.startMockStreams();
    }, 600);
  }

  startMockStreams() {
    // LOG HEARTBEATS
    setInterval(() => {
      useLogsStore.getState().pushLog({
        timestamp: new Date().toLocaleTimeString("en-GB"),
        level: "INFO",
        channel: "system",
        message: "WS heartbeat OK",
      });
    }, 3000);

    // RANDOM PROCESS STATUS
    setInterval(() => {
      const processes = useProcessStore.getState().processes;
      if (!processes.length) return;

      const index = Math.floor(Math.random() * processes.length);
      const p = processes[index];

      const next = p.status === "up" ? "down" : "up";
      useProcessStore.getState().updateProcess({ ...p, status: next });
    }, 4500);
  }

  close() {
    this.manualClose = true;
    useWsStore.getState().setClosed();
  }
}

export const mockWsClient = new MockWsClient();
