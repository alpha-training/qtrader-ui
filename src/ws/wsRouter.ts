// src/ws/wsRouter.ts
import { useProcessStore } from "../store/processStore";
import { useLogsStore } from "../store/logsStore";

// Types for incoming WebSocket messages
type WSMessage =
  | { type: "process_update"; process: any }
  | { type: "process_list"; processes: any[] }
  | { type: "log_entry"; log: any }
  | { type: "heartbeat"; timestamp: string }
  | { type: string; [key: string]: any }; // fallback

export function wsRouter(msg: WSMessage) {
  switch (msg.type) {
    case "process_update": {
      const { process } = msg;
      useProcessStore.getState().updateProcess(process);
      break;
    }

    case "process_list": {
      const { processes } = msg;
      useProcessStore.getState().setProcesses(processes);
      break;
    }

    case "log_entry": {
      const { log } = msg;
      useLogsStore.getState().pushLog(log);
      break;
    }

    case "heartbeat": {
      // later: update heartbeat store
      console.debug("WS Heartbeat:", msg.timestamp);
      break;
    }

    default:
      console.warn("Unknown WS message:", msg);
  }
}
