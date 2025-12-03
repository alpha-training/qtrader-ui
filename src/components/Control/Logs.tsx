// src/components/control/Logs.tsx
import { useEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import LogEntry from "./LogEntry";
import { useProcesses } from "../../context/ProcessContext";

type LogsProps = {
  selectedChannel: string;
  onChannelChange: (ch: string) => void;
};

type Level = "INFO" | "ERROR";

type LogItem = {
  timestamp: string;
  level: Level;
  message: string;
  channel: string;
};

export default function Logs({
  selectedChannel,
  onChannelChange,
}: LogsProps) {
  const { processes } = useProcesses();

  // --- Mock log data (replace with API later) ---
  const [logs, setLogs] = useState<LogItem[]>([
    { timestamp: "09:12:14", level: "INFO",  message: "heartbeat ok", channel: "rdb1" },
    { timestamp: "09:12:14", level: "INFO",  message: "received market snapshot for AAPL", channel: "pxfeed" },
    { timestamp: "09:12:15", level: "INFO",  message: "trade matched: AAPL 100 @ 191.22", channel: "tp1" },
    { timestamp: "09:12:16", level: "ERROR", message: "connection timeout to venue CME", channel: "tp2" },
    { timestamp: "09:12:17", level: "INFO",  message: "writing batch to hdb", channel: "hdb1" },
    { timestamp: "09:12:18", level: "INFO",  message: "order updated: #482913 status=FILLED", channel: "oms" },
    { timestamp: "09:12:19", level: "INFO",  message: "processing 245 tick updates", channel: "pxfeed" },
    { timestamp: "09:12:20", level: "ERROR", message: "wdb2 out of sync with rdb1", channel: "wdb2" },
    { timestamp: "09:12:21", level: "INFO",  message: "risk check passed for order #482913", channel: "risk" },
    { timestamp: "09:12:22", level: "INFO",  message: "audit log write successful", channel: "audit" },
    { timestamp: "09:12:23", level: "INFO",  message: "publishing L2 updates for ETH-USD", channel: "pxfeed" },
    { timestamp: "09:12:24", level: "ERROR", message: "disk threshold exceeded on hdb2", channel: "hdb2" },
    { timestamp: "09:12:25", level: "INFO",  message: "rdb1 latency spike detected (4.2ms)", channel: "rdb1" },
    { timestamp: "09:12:26", level: "INFO",  message: "cleanup completed (took 183ms)", channel: "tp1" },
  ]);

  // --- Channels ordered to match process table ---
  const processOrder = processes.map(p => p.name);
  const logChannels = Array.from(new Set(logs.map(l => l.channel)));

  const orderedChannels = processOrder.filter(name =>
    logChannels.includes(name)
  );

  const extraChannels = logChannels.filter(
    ch => !processOrder.includes(ch)
  );

  const channels = ["All", ...orderedChannels, ...extraChannels];

  // --- UI state ---
  const [showInfo, setShowInfo] = useState(true);
  const [showError, setShowError] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const logContainerRef = useRef<HTMLDivElement>(null);

  // --- Filter logs ---
  const filteredLogs = logs.filter(log => {
    const matchesChannel =
      selectedChannel === "All" || log.channel === selectedChannel;

    const matchesLevel =
      (log.level === "INFO" && showInfo) ||
      (log.level === "ERROR" && showError);

    return matchesChannel && matchesLevel;
  });

  // --- Auto scroll ---
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop =
        logContainerRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  // --- Refresh handler ---
  const refreshLogs = async () => {
    setIsRefreshing(true);

    await new Promise(res => setTimeout(res, 600));

    setLogs(prev => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString("en-GB"),
        level: "INFO",
        message: "log refreshed",
        channel: selectedChannel === "All" ? "system" : selectedChannel,
      },
    ]);

    setIsRefreshing(false);
  };

  // --- Render ---
  return (
    <div className="mt-4">
      {/* Title + Refresh */}
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

      {/* Channel tabs */}
      <div className="flex gap-4 text-gray-400 mb-3 flex-wrap">
        {channels.map(ch => {
          const active = selectedChannel === ch;
          return (
            <button
              key={ch}
              onClick={() => onChannelChange(ch)}
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

      {/* Filters + auto-scroll */}
      <div className="flex items-center gap-4 text-gray-300 mb-2">
        <label className="flex items-center gap-1 text-xs">
          <input
            type="checkbox"
            checked={showInfo}
            onChange={e => setShowInfo(e.target.checked)}
          />
          info
        </label>

        <label className="flex items-center gap-1 text-xs">
          <input
            type="checkbox"
            checked={showError}
            onChange={e => setShowError(e.target.checked)}
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

      {/* Log window */}
      <div
        ref={logContainerRef}
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
