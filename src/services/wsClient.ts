// src/services/wsClient.ts
// Dummy WebSocket client: no real backend required yet

import { useProcessStore } from "../store/processStore";
import { useLogsStore } from "../store/logsStore";

class WSClient {
  private socket: WebSocket | null = null;
  private processTimer: number | null = null;
  private logTimer: number | null = null;

  connect() {
    console.log("WS: connecting (mock)…");

    // Ensure mock processes are loaded
    const { processes, initMock } = useProcessStore.getState();
    if (!processes || processes.length === 0) {
      initMock();
    }

    console.warn("▲ Mock WS logs enabled");

    // Fake process updates every 5 seconds
    this.processTimer = window.setInterval(() => {
      const state = useProcessStore.getState();
      const target = state.processes.find((p) => p.name === "hdb1");
      if (!target) return;

      const goingDown = target.status === "up";

      useProcessStore
        .getState()
        .updateFromWS({
          name: "hdb1",
          status: goingDown ? "down" : "up",
          pid: goingDown ? null : 9999,
          mem: goingDown ? null : "90 MB / 256 MB",
        });
    }, 5000);

    // Fake log heartbeat every 3 seconds
    this.logTimer = window.setInterval(() => {
      useLogsStore.getState().pushLog({
        timestamp: new Date().toLocaleTimeString("en-GB"),
        level: "INFO",
        message: "WS heartbeat OK",
        channel: "system",
      });
    }, 3000);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    if (this.processTimer !== null) {
      window.clearInterval(this.processTimer);
      this.processTimer = null;
    }
    if (this.logTimer !== null) {
      window.clearInterval(this.logTimer);
      this.logTimer = null;
    }
  }
}

const wsClient = new WSClient();
export default wsClient;
