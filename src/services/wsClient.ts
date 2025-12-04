// src/services/wsClient.ts
import { useProcessStore } from "../store/processStore";
import { useLogsStore } from "../store/logsStore";
import type { WSProcessUpdate, WSLogEntry } from "../types/wsTypes";

function randomPid() {
  return 2000 + Math.floor(Math.random() * 4000);
}

function randomMem() {
  const used = 32 + Math.floor(Math.random() * 96);
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
    console.warn("⚠ Mock WS logs enabled");
    console.warn("⚠ Mock WS process updates enabled");

    // Fake status flip
    setInterval(() => {
      const store = useProcessStore.getState();
      const processes = store.processes;

      if (!processes.length) return;

      const target =
        processes[Math.floor(Math.random() * processes.length)];

      const flip =
        target.status === "up" && Math.random() < 0.3 ? "down" : "up";

      const update: WSProcessUpdate = {
        type: "process.update",
        name: target.name,
        status: flip,
        pid: flip === "up" ? randomPid() : null,
        mem: flip === "up" ? randomMem() : "-",
      };

      store.applyWsUpdate(update);

      // Emit log
      const log: WSLogEntry = {
        type: "log.entry",
        timestamp: new Date().toLocaleTimeString("en-GB"),
        level: "INFO",
        message: `process ${target.name} is now ${flip}`,
        channel: target.name,
      };

      useLogsStore.getState().addLog(log);
    }, 10_000);

    // Heartbeat
    setInterval(() => {
      const log: WSLogEntry = {
        type: "log.entry",
        timestamp: new Date().toLocaleTimeString("en-GB"),
        level: "INFO",
        message: "WS heartbeat OK",
        channel: "system",
      };

      useLogsStore.getState().addLog(log);
    }, 3_000);
  }
}

const wsClient = new WSClient();
export default wsClient;
