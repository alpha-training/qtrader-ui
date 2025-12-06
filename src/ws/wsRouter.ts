// src/ws/wsRouter.ts
import { useProcessStore } from "../store/processStore";
import { useLogsStore } from "../store/logsStore";
import { useToastStore } from "../store/toastStore";
import { wsClient } from "./wsProvider";

export function wsRouter(raw: any) {
  let msg = raw;

  // Accept string or JSON
  if (typeof raw === "string") {
    try {
      msg = JSON.parse(raw);
    } catch {
      console.warn("WS message not JSON:", raw);
      return;
    }
  }

  switch (msg.type) {
    // ======================================================
    // PROCESS UPDATE
    // ======================================================
    case "process_update": {
      useProcessStore.getState().updateProcess(msg.process);
      break;
    }

    case "process_list": {
      useProcessStore.getState().setProcesses(msg.processes);
      break;
    }

    // ======================================================
    // LOG ENTRY
    // ======================================================
    case "log_entry": {
      const log = msg.log;

      // Prefer wsProvider batching
      if ("bufferLog" in wsClient) {
        (wsClient as any).bufferLog(log);
      } else {
        // Fallback (mock WS)
        useLogsStore.getState().pushLog(log);
      }
      break;
    }

    // ======================================================
    // HEARTBEAT
    // ======================================================
    case "heartbeat": {
      // console.debug("Heartbeat:", msg.timestamp);
      break;
    }

    // ======================================================
    // PROCESS START SUCCESS
    // ======================================================
    case "process_start_ok": {
      const p = msg.process;

      useProcessStore.getState().updateStatus(p, "up");
      useProcessStore.getState().clearPending(p);

      useToastStore.getState().push("success", `Process ${p} started`);
      break;
    }

    // ======================================================
    // PROCESS START ERROR
    // ======================================================
    case "process_start_error": {
      const p = msg.process;

      useProcessStore.getState().clearPending(p);

      useToastStore
        .getState()
        .push("error", `Failed to start ${p}: ${msg.error ?? "unknown error"}`);
      break;
    }

    // ======================================================
    // PROCESS STOP SUCCESS
    // ======================================================
    case "process_stop_ok": {
      const p = msg.process;

      useProcessStore.getState().updateStatus(p, "down");
      useProcessStore.getState().clearPending(p);

      useToastStore.getState().push("success", `Process ${p} stopped`);
      break;
    }

    // ======================================================
    // PROCESS STOP ERROR
    // ======================================================
    case "process_stop_error": {
      const p = msg.process;

      useProcessStore.getState().clearPending(p);

      useToastStore
        .getState()
        .push("error", `Failed to stop ${p}: ${msg.error ?? "unknown error"}`);
      break;
    }

    // ======================================================
    // LOGS PAGINATION
    // ======================================================
    case "logs_page": {
      useLogsStore.getState().prependLogs(msg.logs);
      break;
    }

    case "logs_page_info": {
      console.debug("Logs page info:", msg);
      break;
    }

    // ======================================================
    // UNKNOWN
    // ======================================================
    default:
      console.warn("Unknown WS message:", msg);
  }
}
