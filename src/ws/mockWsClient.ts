// src/ws/mockWsClient.ts
import type { IWebSocketClient } from "./IWebSocketClient";
import { useWsStore } from "../store/wsStore";
import { wsRouter } from "./wsRouter";

export class MockWsClient implements IWebSocketClient {
  ws: null = null;
  reconnectTimer: null = null;
  manualClose = false;

  connect() {
    console.log("Mock WS: connecting...");
    useWsStore.getState().setConnecting();

    setTimeout(() => {
      console.log("Mock WS: connected");
      useWsStore.getState().setConnected();

      // send initial process list
      this.sendInitialProcesses();
      this.startMockLogs();
    }, 400);
  }

  // ------------------------------------------------
  // These mirror real WS API used by processStore
  // ------------------------------------------------
  processStart(name: string) {
    console.log("[MOCK] processStart", name);

    setTimeout(() => {
      wsRouter(
        JSON.stringify({
          type: "process_start_ok",
          process: name,
        })
      );
    }, 800);
  }

  processStop(name: string) {
    console.log("[MOCK] processStop", name);

    setTimeout(() => {
      wsRouter(
        JSON.stringify({
          type: "process_stop_ok",
          process: name,
        })
      );
    }, 800);
  }

  requestLogsPage(beforeTimestamp?: string) {
    setTimeout(() => {
      wsRouter(
        JSON.stringify({
          type: "logs_page",
          logs: [
            {
              timestamp: "08:00:00",
              level: "INFO",
              channel: "system",
              message: "Older log entry (mock)",
            },
          ],
        })
      );
    }, 300);
  }

  close() {
    this.manualClose = true;
    useWsStore.getState().setClosed();
  }

  // ------------------------------------------------
  // MOCK data streams
  // ------------------------------------------------
  private sendInitialProcesses() {
    const processes = [
      { name: "tp1", host: "localhost", port: 5010, status: "up" },
      { name: "tp2", host: "localhost", port: 5011, status: "down" },
      { name: "rdb1", host: "localhost", port: 5020, status: "up" },
      { name: "rdb2", host: "localhost", port: 5021, status: "up" },
      { name: "wdb1", host: "localhost", port: 5030, status: "down" },
      { name: "wdb2", host: "localhost", port: 5031, status: "up" },
      { name: "hdb1", host: "localhost", port: 5040, status: "up" },
      { name: "hdb2", host: "localhost", port: 5041, status: "down" },
      { name: "pxfeed", host: "localhost", port: 5050, status: "up" },
      { name: "oms", host: "localhost", port: 5060, status: "down" },
    ];

    wsRouter(
      JSON.stringify({
        type: "process_list",
        processes,
      })
    );
  }

  private startMockLogs() {
    setInterval(() => {
      wsRouter(
        JSON.stringify({
          type: "log_entry",
          log: {
            timestamp: new Date().toLocaleTimeString("en-GB"),
            level: "INFO",
            channel: "system",
            message: "WS heartbeat OK (mock)",
          },
        })
      );
    }, 3000);
  }
}

export const mockWsClient = new MockWsClient();
