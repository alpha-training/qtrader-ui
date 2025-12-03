// src/components/control/Logs.tsx
import { useEffect, useRef, useState } from "react";
import LogEntry from "./LogEntry";
import { RotateCw } from "lucide-react";
import { useLogs } from "../../context/LogContext";
import { useProcesses } from "../../context/ProcessContext";

type LogsProps = {
  selectedChannel: string;
  onChannelChange: (ch: string) => void;
};

export default function Logs({ selectedChannel, onChannelChange }: LogsProps) {
  const { logs } = useLogs();
  const { processes } = useProcesses();

  const processOrder = processes.map(p => p.name);
  const loggedChannels = Array.from(new Set(logs.map(l => l.channel)));

  const channels = [
    "All",
    ...processOrder,
    ...loggedChannels.filter(ch => !processOrder.includes(ch)), // audit/system, etc.
  ];

  const [showInfo, setShowInfo] = useState(true);
  const [showError, setShowError] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const logRef = useRef<HTMLDivElement>(null);

  const filteredLogs = logs.filter(log => {
    const matchChannel =
      selectedChannel === "All" || log.channel === selectedChannel;

    const matchLevel =
      (log.level === "INFO" && showInfo) ||
      (log.level === "ERROR" && showError);

    return matchChannel && matchLevel;
  });

  useEffect(() => {
    if (autoScroll && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  const refresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 600));
    setRefreshing(false);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-semibold">Logs:</h2>

        <button
          onClick={refresh}
          disabled={refreshing}
          className="
            flex items-center gap-1 px-2 py-0.5 text-xs rounded-sm border
            border-gray-600 text-gray-200 hover:bg-gray-700 transition
            disabled:opacity-50
          "
        >
          <RotateCw
            size={14}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* CHANNEL TABS */}
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

      {/* FILTERS & AUTO SCROLL */}
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

      {/* LOG WINDOW */}
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
