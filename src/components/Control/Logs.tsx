import { useEffect, useRef, useState } from "react";
import LogEntry from "./LogEntry";

const channels = ["All", "tp1", "rdb1", "wdb1", "hdb1", "start1"];

const mockLogs = [
  { timestamp: "17:56:26", level: "INFO", message: "heartbeat ok", channel: "rdb1" },
  { timestamp: "17:56:27", level: "INFO", message: "processing trades...", channel: "rdb1" },
  { timestamp: "17:56:26", level: "ERROR", message: "connection lost", channel: "rdb1" },
  { timestamp: "17:56:26", level: "INFO", message: "heartbeat ok", channel: "wdb1" },
  { timestamp: "17:56:27", level: "INFO", message: "processing trades...", channel: "tp1" },
];

type LogsProps = {
  selectedChannel: string;
  onChannelChange: (channel: string) => void;
};

export default function Logs({
  selectedChannel,
  onChannelChange,
}: LogsProps) {
  const [showInfo, setShowInfo] = useState(true);
  const [showError, setShowError] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);

  const logContainerRef = useRef<HTMLDivElement>(null);

  const filtered = mockLogs.filter(log => {
    const chMatch = selectedChannel === "All" || log.channel === selectedChannel;
    const levelMatch =
      (log.level === "INFO" && showInfo) ||
      (log.level === "ERROR" && showError);

    return chMatch && levelMatch;
  });

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop =
        logContainerRef.current.scrollHeight;
    }
  }, [filtered, autoScroll]);

  return (
    <div className="mt-10">

      {/* Title */}
      <h2 className="text-xl font-semibold mb-4">Logs:</h2>

      {/* Tabs + Refresh button */}
      <div className="flex items-center justify-between mb-4">

        {/* Tabs */}
        <div className="flex items-center gap-4 text-gray-400">
          {channels.map(ch => (
            <button
              key={ch}
              onClick={() => onChannelChange(ch)}
              className={`text-sm transition ${
                selectedChannel === ch
                  ? "text-white font-medium underline underline-offset-4"
                  : "hover:text-white"
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        {/* Refresh button */}
        <button
          className="px-3 py-1.5 rounded-md border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white transition text-sm"
          onClick={() => console.log("Refresh clicked")}
        >
          Refresh
        </button>
      </div>

      {/* Message types + auto-scroll */}
      <div className="flex justify-between items-center mb-3">

        {/* Left side: checkboxes */}
        <div className="flex items-center gap-6 text-gray-300 text-sm">
          <span>Message types:</span>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showInfo}
              onChange={() => setShowInfo(v => !v)}
              className="w-4 h-4"
            />
            info
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showError}
              onChange={() => setShowError(v => !v)}
              className="w-4 h-4"
            />
            error
          </label>
        </div>

        {/* Right side: Auto-scroll */}
        <div className="flex items-center gap-3 text-sm text-gray-300">
          Auto-scroll

          <button
            onClick={() => setAutoScroll(v => !v)}
            className={`
              relative w-10 h-5 rounded-full transition
              ${autoScroll ? "bg-blue-500" : "bg-gray-600"}
            `}
          >
            <span
              className={`
                absolute top-0.5 block w-4 h-4 bg-white rounded-full transition
                ${autoScroll ? "left-5" : "left-0.5"}
              `}
            />
          </button>
        </div>
      </div>

      {/* Log window */}
      <div
        ref={logContainerRef}
        className="h-64 overflow-y-auto border border-gray-800 rounded-lg p-4 bg-[#11161b]"
      >
        {filtered.length === 0 && (
          <div className="text-gray-500 italic text-sm">No logs.</div>
        )}

        {filtered.map((log, i) => (
          <LogEntry
            key={i}
            timestamp={log.timestamp}
            level={log.level as "INFO" | "ERROR"}
            message={log.message}
          />
        ))}
      </div>
    </div>
  );
}
