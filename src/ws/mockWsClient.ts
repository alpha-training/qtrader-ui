// src/ws/mockWsClient.ts
import type { IWebSocketClient } from "./IWebSocketClient";
import { useProcessStore } from "../store/processStore";
import { useWsStore } from "../store/wsStore";
import { useLogsStore } from "../store/logsStore";
import { wsRouter } from "./wsRouter";

class MockWsClient implements IWebSocketClient {
  ws = null;
  reconnectTimer: number | null = null;
  manualClose = false;

  // Prevent duplicate listeners & intervals
  private pendingListenerInstalled = false;
  private logInterval: number | null = null;

  connect() {
    console.log("Mock WS: connecting...");
    useWsStore.getState().setConnecting();

    setTimeout(() => {
      console.log("Mock WS: connected");
      useWsStore.getState().setConnected();

      if (!this.pendingListenerInstalled) {
        this.installPendingListener();
        this.pendingListenerInstalled = true;
      }

      if (!this.logInterval) {
        this.startMockLogs();
      }
    }, 400);
  }

  // --------------------------------------------------
  // LISTEN FOR pending state changes (start/stop)
  // --------------------------------------------------
  installPendingListener() {
    console.log("[MOCK] installPendingListener");

    let prevPending = useProcessStore.getState().pending;
    let prevBulk = useProcessStore.getState().isBulkOperation;

    useProcessStore.subscribe((state) => {
      const nextPending = state.pending;
      const nextBulk = state.isBulkOperation;

      //  Bulk start
      if (!prevBulk && nextBulk && Object.values(nextPending).includes("start")) {
        console.log("[MOCK] simulate bulk START");
        this.processStartAll();
      }

      //  Bulk stop
      if (!prevBulk && nextBulk && Object.values(nextPending).includes("stop")) {
        console.log("[MOCK] simulate bulk STOP");
        this.processStopAll();
      }

      //  Single process detection
      for (const name of Object.keys(nextPending)) {
        const before = prevPending[name];
        const after = nextPending[name];

        if (before !== after && after !== null) {
          if (after === "start") this.simulateStart(name);
          if (after === "stop") this.simulateStop(name);
        }
      }

      prevPending = nextPending;
      prevBulk = nextBulk;
    });
  }

  // --------------------------------------------------
  // SIMULATED BACKEND RESPONSES
  // --------------------------------------------------
  simulateStart(name: string) {
    console.log(`[MOCK] simulateStart(${name})`);

    setTimeout(() => {
      wsRouter({
        type: "process_start_ok",
        process: name,
      });
    }, 200);
  }

  simulateStop(name: string) {
    console.log(`[MOCK] simulateStop(${name})`);

    setTimeout(() => {
      wsRouter({
        type: "process_stop_ok",
        process: name,
      });
    }, 200);
  }

  // Bulk start/stop
  processStartAll() {
    setTimeout(() => {
      wsRouter({ type: "process_start_all_ok" });
    }, 300);
  }

  processStopAll() {
    setTimeout(() => {
      wsRouter({ type: "process_stop_all_ok" });
    }, 300);
  }

  // --------------------------------------------------
  // Mock logs (runs once)
  // --------------------------------------------------
  startMockLogs() {
    this.logInterval = window.setInterval(() => {
      useLogsStore.getState().pushLog({
        timestamp: new Date().toLocaleTimeString("en-GB"),
        level: "INFO",
        channel: "system",
        message: "WS heartbeat OK (mock)",
      });
    }, 2500);
  }

  close() {
    this.manualClose = true;
    useWsStore.getState().setClosed();

    if (this.logInterval) {
      clearInterval(this.logInterval);
      this.logInterval = null;
    }
  }
}

export const mockWsClient = new MockWsClient();