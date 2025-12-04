// src/components/control/Logs.tsx
import { useEffect, useRef, useState } from "react";
import { useLogsStore } from "../../store/logsStore";
import LogEntry from "./LogEntry";
import { RotateCw } from "lucide-react";

export default function Logs() {
  const { logs } = useLogsStore();

  // UI state
  const [selectedChannel, setSelectedChannel] = useState("All");
  const [showInfo, setShowInfo] = useState(true);
  const [showError, setShowError] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const logRef = useRef<HTMLDivElement>(null);

  // Channels (tabs)
  const uniqueChannels = Array.from(new Set(logs.map(l => l.channel))).sort();
  const channels = ["All", ...uniqueChannels];

  // Filters
  const filtered = logs.filter(log => {
    const matchChannel =
      selectedChannel === "All" || log.channel === selectedChannel;

    const matchLevel =
      (log.level === "INFO" && showInfo) ||
      (log.level === "ERROR" && showError);

    return matchChannel && matchLevel;
  });

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [filtered, autoScroll]);

  // Refresh button (mock)
  const refreshLogs = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="mt-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-base">Logs:</h2>

        <button
          onClick={refreshLogs}
          disabled={isRefreshing}
          className={`
            flex items-center gap-1 px-2 py-0.5 text-xs rounded-sm border border-gray-600
            transition ${isRefreshing ? "opacity-50" : "hover:bg-gray-700"}
          `}
        >
          <RotateCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* CHANNEL TABS */}
      <div className="flex gap-4 text-gray-400 mb-3">
        {channels.map(ch => (
          <button
            key={ch}
            onClick={() => setSelectedChannel(ch)}
            className={`
              text-xs transition
              ${
                selectedChannel === ch
                  ? "text-blue-400 underline font-semibold"
                  : "hover:text-white"
              }
            `}
          >
            {ch}
          </button>
        ))}
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-4 text-gray-300 mb-2">
        <label className="text-xs flex items-center gap-1">
          <input
            type="checkbox"
            checked={showInfo}
            onChange={(e) => setShowInfo(e.target.checked)}
          />
          info
        </label>

        <label className="text-xs flex items-center gap-1">
          <input
            type="checkbox"
            checked={showError}
            onChange={(e) => setShowError(e.target.checked)}
          />
          error
        </label>

        {/* AUTO-SCROLL */}
        <div className="ml-auto text-xs flex items-center gap-2">
          Auto-scroll
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`
              relative w-9 h-4 rounded-full transition
              ${autoScroll ? "bg-blue-500" : "bg-gray-500"}
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

      {/* OUTPUT */}
      <div
        ref={logRef}
        className="h-64 bg-[#11161b] border border-gray-800 rounded-md overflow-y-auto p-2 text-sm"
      >
        {filtered.length === 0 ? (
          <div className="text-gray-500 text-xs italic">No logs.</div>
        ) : (
          filtered.map((log, idx) => <LogEntry key={idx} {...log} />)
        )}
      </div>
    </div>
  );
}
