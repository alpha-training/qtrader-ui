// src/services/wsClient.ts
// Dummy WebSocket client (mocked)

import { useProcessStore } from "../store/processStore";
import { useLogsStore } from "../store/logsStore";
import type { WSProcessUpdate, WSLogEntry } from "../types/wsTypes";

function randomPid() {
  return 3000 + Math.floor(Math.random() * 3000);
}

function randomMem() {
  const used = 64 + Math.floor(Math.random() * 64);
  const total = 128;
  return `${used} MB / ${total} MB`;
}

class WSClient {
  private connected = false;

  connect() {
    if (this.connected) return;
    console.log("WS: connecting (mock)...");
    this.connected = true;

    this.startMockStreams();
  }

  private startMockStreams() {
    console.warn("►► Mock WS process updates enabled");
    console.warn("►► Mock WS logs enabled");

    // ---------------------
    // Process heartbeat updates
    // ---------------------
    setInterval(() => {
      const store = useProcessStore.getState();
      const { processes, applyWsUpdate } = store;

      if (!processes.length) return;

      const target =
        processes[Math.floor(Math.random() * processes.length)];

      const flip = target.status === "up" && Math.random() < 0.3 ? "down" : "up";

      const update: WSProcessUpdate = {
        type: "process_update",
        name: target.name,
        status: flip,
        pid: flip === "up" ? randomPid() : null,
        mem: flip === "up" ? randomMem() : null,
      };

      applyWsUpdate(update);

      const log: WSLogEntry = {
        type: "log_entry",
        timestamp: new Date().toLocaleTimeString("en-GB"),
        level: flip === "up" ? "INFO" : "ERROR",
        channel: target.name,
        message: `process ${target.name} -> ${flip}`,
      };

      useLogsStore.getState().pushLog(log);
    }, 10_000);

    // ---------------------
    // System heartbeat
    // ---------------------
    setInterval(() => {
      const heartbeat: WSLogEntry = {
        type: "log_entry",
        timestamp: new Date().toLocaleTimeString("en-GB"),
        level: "INFO",
        channel: "system",
        message: "WS heartbeat OK",
      };

      useLogsStore.getState().pushLog(heartbeat);
    }, 3_000);
  }
}

const wsClient = new WSClient();
export default wsClient;
