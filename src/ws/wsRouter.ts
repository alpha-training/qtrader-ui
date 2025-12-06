// src/ws/wsRouter.ts
import { useProcessStore } from "../store/processStore";
import { useLogsStore } from "../store/logsStore";
import { wsClient } from "./wsProvider";

export function wsRouter(raw: any) {
  let msg = raw;

  if (typeof raw === "string") {
    try {
      msg = JSON.parse(raw);
    } catch {
      console.warn("WS message not JSON:", raw);
      return;
    }
  }

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

    // ⭐ UPDATED TO USE BUFFER
    case "log_entry": {
      const { log } = msg;
      wsClient.bufferLog(log);
      break;
    }

    case "heartbeat": {
      console.debug("WS heartbeat:", msg.timestamp);
      break;
    }

    case "process_start_ok": {
      const { process } = msg;
      
      useProcessStore.getState().updateStatus(process, "up");
      useProcessStore.getState().clearPending(process);
    
      console.info(`Process started: ${process}`);
      break;
    }
    
    case "process_start_error": {
      const { process } = msg;
    
      useProcessStore.getState().clearPending(process);
      console.error(`Failed to start ${process}`);
      break;
    }
    
    case "process_stop_ok": {
      const { process } = msg;
    
      useProcessStore.getState().updateStatus(process, "down");
      useProcessStore.getState().clearPending(process);
    
      console.info(`Process stopped: ${process}`);
      break;
    }
    
    case "process_stop_error": {
      const { process } = msg;
    
      useProcessStore.getState().clearPending(process);
      console.error(`Failed to stop ${process}`);
      break;
    }
    

    case "logs_page": {
      const { logs } = msg;
      useLogsStore.getState().prependLogs(logs);
      break;
    }

    case "logs_page_info": {
      console.debug("Logs page info:", msg);
      break;
    }

    default:
      console.warn("Unknown WS message:", msg);
  }
}
