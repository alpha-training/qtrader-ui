// src/ws/wsRouter.ts
import { useProcessStore } from "../store/processStore";
import { useLogsStore } from "../store/logsStore";
import { useToastStore } from "../store/toastStore";
import { wsClient } from "./wsProvider";

export function wsRouter(raw: any) {
  let msg = raw;

  // Allow raw string or parsed JSON
  if (typeof raw === "string") {
    try {
      msg = JSON.parse(raw);
    } catch {
      console.warn("WS message not JSON:", raw);
      return;
    }
  }

  const processStore = useProcessStore.getState();
  const toastStore = useToastStore.getState();

  const isBulk = processStore.isBulkOperation;

  switch (msg.type) {
    // -------------------------------------------------------
    // PROCESS UPDATE / PROCESS LIST
    // -------------------------------------------------------
    case "process_update": {
      processStore.updateProcess(msg.process);
      break;
    }

    case "process_list": {
      processStore.setProcesses(msg.processes);
      break;
    }

    // -------------------------------------------------------
    // LOG ENTRY
    // -------------------------------------------------------
    case "log_entry": {
      const log = msg.log;

      if ("bufferLog" in wsClient) {
        (wsClient as any).bufferLog(log);
      } else {
        useLogsStore.getState().pushLog(log);
      }
      break;
    }

    // -------------------------------------------------------
    // SINGLE PROCESS START OK
    // -------------------------------------------------------
    case "process_start_ok": {
      const p = msg.process;

      processStore.updateStatus(p, "up");
      processStore.clearPending(p);

      if (!isBulk) {
        toastStore.push("success", `Process ${p} started`);
      }
      break;
    }

    // -------------------------------------------------------
    // SINGLE PROCESS STOP OK
    // -------------------------------------------------------
    case "process_stop_ok": {
      const p = msg.process;

      processStore.updateStatus(p, "down");
      processStore.clearPending(p);

      if (!isBulk) {
        toastStore.push("warning", `Process ${p} stopped`);
      }
      break;
    }

    // -------------------------------------------------------
    // SINGLE PROCESS START/STOP ERROR
    // -------------------------------------------------------
    case "process_start_error": {
      const p = msg.process;
      processStore.clearPending(p);
      toastStore.push("error", `Failed to start ${p}: ${msg.error ?? "unknown error"}`);
      break;
    }

    case "process_stop_error": {
      const p = msg.process;
      processStore.clearPending(p);
      toastStore.push("error", `Failed to stop ${p}: ${msg.error ?? "unknown error"}`);
      break;
    }

    // -------------------------------------------------------
    // BULK START OK
    // -------------------------------------------------------
    case "process_start_all_ok": {
      toastStore.push("success", "All processes started");
      processStore.clearAllPending();
      processStore.setBulkMode(false);
      break;
    }

    // -------------------------------------------------------
    // BULK STOP OK
    // -------------------------------------------------------
    case "process_stop_all_ok": {
      toastStore.push("warning", "All processes stopped");
      processStore.clearAllPending();
      processStore.setBulkMode(false);
      break;
    }

    // -------------------------------------------------------
    // PAGINATED LOGS
    // -------------------------------------------------------
    case "logs_page": {
      useLogsStore.getState().prependLogs(msg.logs);
      break;
    }

    case "logs_page_info": {
      console.debug("Logs page info:", msg);
      break;
    }

    // -------------------------------------------------------
    // UNKNOWN
    // -------------------------------------------------------
    default:
      console.warn("Unknown WS message:", msg);
  }
}
