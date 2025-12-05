// src/ws/wsRouter.ts
import { useProcessStore } from "../store/processStore";
import { useLogsStore } from "../store/logsStore";

export function wsRouter(msg: any) {
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
      console.debug("WS heartbeat:", msg.timestamp);
      break;
    }

    default:
      console.warn("Unknown WS message:", msg);
  }
}