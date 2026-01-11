import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import LogEntry from "./LogEntry";

import { useLogsStore } from "../../store/logsStore";
import { useProcessStore } from "../../store/processStore";
import { logsApi } from "../../api/logsApi";
import { config } from "../../config";
import { connectLogStreamMock, connectLogStream } from "../../api/logs";

type LogsProps = {
  selectedChannel: string;
  onChannelChange: (ch: string) => void;
};

export default function Logs({ selectedChannel, onChannelChange }: LogsProps) {
  // STORES
  const logs = useLogsStore((s) => s.logs);
  const pushLog = useLogsStore((s) => s.pushLog);
  const clearLogs = useLogsStore((s) => s.clearLogs);

  const processes = useProcessStore((s) => s.processes);
  const setSelectedProcess = useProcessStore((s) => s.setSelectedProcess);

  // LOCAL UI STATE
  const [showInfo, setShowInfo] = useState(true);
  const [showError, setShowError] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const logRef = useRef<HTMLDivElement>(null);

  /**
   * Initial load:
   * - mock: load mock history
   * - real: skip getAll (backend doesn't provide "all logs" endpoint)
   */
  useEffect(() => {
    let alive = true;

    async function loadMockHistory() {
      try {
        const items = await logsApi.getAll();
        if (!alive) return;
        clearLogs();
        items.forEach((l) => pushLog(l));
      } catch {
        // ignore
      }
    }

    if (config.apiMode !== "real") loadMockHistory();

    return () => {
      alive = false;
    };
  }, [clearLogs, pushLog]);

  /**
   * ✅ Start ONE log stream and push into zustand store.
   * IMPORTANT: If you also run a LogProvider that starts a stream,
   * you'll get duplicates / repeated console logs.
   */
  useEffect(() => {
    if (!processes.length) return;

    const stop =
      config.apiMode === "real"
        ? connectLogStream(processes, pushLog, { pollMs: 2000 })
        : connectLogStreamMock(processes, pushLog);

    return () => stop?.();
  }, [processes, pushLog]);

  // CHANNEL TABS ORDER
  const processNames = useMemo(() => processes.map((p) => p.name), [processes]);

  const logChannels = useMemo(
    () => Array.from(new Set(logs.map((l) => l.channel))),
    [logs]
  );

  const extraChannels = useMemo(
    () => logChannels.filter((ch) => !processNames.includes(ch)).sort(),
    [logChannels, processNames]
  );

  const channels = useMemo(
    () => ["All", ...processNames, ...extraChannels],
    [processNames, extraChannels]
  );

  // FILTERED LOGS
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchChannel =
        selectedChannel === "All" || log.channel === selectedChannel;

      const matchLevel =
        (log.level === "INFO" && showInfo) ||
        (log.level === "ERROR" && showError);

      return matchChannel && matchLevel;
    });
  }, [logs, selectedChannel, showInfo, showError]);

  // AUTO-SCROLL on new logs (while enabled)
  useEffect(() => {
    if (autoScroll && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  // ✅ NEW: when channel changes, jump to bottom once (only if autoScroll is ON)
  useEffect(() => {
    if (!autoScroll) return;

    // wait for DOM paint so height is correct
    const id = window.requestAnimationFrame(() => {
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    });

    return () => window.cancelAnimationFrame(id);
  }, [selectedChannel, autoScroll]);

  // REFRESH (manual marker)
  const refreshLogs = async () => {
    setIsRefreshing(true);
    await new Promise((res) => setTimeout(res, 250));

    pushLog({
      timestamp: new Date().toISOString(),
      level: "INFO",
      channel: selectedChannel === "All" ? "system" : selectedChannel,
      message: "Manual refresh",
      type: "log_entry",
    });

    setIsRefreshing(false);
  };

  // CHANNEL CLICK HANDLER
  const handleChannelClick = (channel: string) => {
    onChannelChange(channel);
    if (channel !== "All") setSelectedProcess(channel);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-semibold">Logs:</h2>

        <button
          onClick={refreshLogs}
          disabled={isRefreshing}
          className={`
            flex items-center gap-1 px-2 py-0.5 text-xs rounded-sm border
            border-gray-600 text-gray-200 hover:bg-gray-700 transition
            ${isRefreshing ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <RotateCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="flex gap-4 text-gray-400 mb-3 flex-wrap">
        {channels.map((ch) => {
          const active = selectedChannel === ch;
          return (
            <button
              key={ch}
              onClick={() => handleChannelClick(ch)}
              className={`
                text-xs transition
                ${
                  active
                    ? "text-blue-400 font-semibold underline underline-offset-4"
                    : "text-gray-400 hover:text-white"
                }
              `}
            >
              {ch}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-gray-300 mb-2">
        <label className="flex items-center gap-1 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={showInfo}
            onChange={(e) => setShowInfo(e.target.checked)}
          />
          info
        </label>

        <label className="flex items-center gap-1 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={showError}
            onChange={(e) => setShowError(e.target.checked)}
          />
          error
        </label>

        <div className="flex items-center gap-1 ml-auto text-xs">
          Auto-scroll
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`
              relative w-9 h-4 rounded-full transition
              ${autoScroll ? "bg-blue-500" : "bg-gray-600"}
            `}
          >
            <span
              className={`
                absolute w-3.5 h-3.5 bg-white rounded-full top-0.5 transition
                ${autoScroll ? "left-5" : "left-0.5"}
              `}
            />
          </button>
        </div>
      </div>

      <div
        ref={logRef}
        className="h-64 overflow-y-auto border border-gray-800 rounded-md p-2 bg-[#11161b] text-sm"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-gray-500 text-xs italic">No logs.</div>
        ) : (
          filteredLogs.map((log, i) => <LogEntry key={i} {...log} />)
        )}
      </div>
    </div>
  );
}
