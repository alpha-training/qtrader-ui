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
  onRefresh?: () => void; // опционально, для будущего API
};

export default function Logs({
  selectedChannel,
  onChannelChange,
  onRefresh,
}: LogsProps) {
  const [showInfo, setShowInfo] = useState(true);
  const [showError, setShowError] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const logContainerRef = useRef<HTMLDivElement>(null);

  const filteredLogs = mockLogs.filter((log) => {
    const channelMatches =
      selectedChannel === "All" || log.channel === selectedChannel;

    const levelMatches =
      (log.level === "INFO" && showInfo) ||
      (log.level === "ERROR" && showError);

    return channelMatches && levelMatches;
  });

  const scrollToBottom = () => {
    const el = logContainerRef.current;
    if (!el || !autoScroll) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredLogs.length]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await Promise.resolve(onRefresh());
      } else {
        await new Promise((res) => setTimeout(res, 400));
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Logs:</h2>

      <div className="flex items-center justify-between mb-3">
        {/* Tabs */}
        <div className="flex items-center gap-4 text-gray-400">
          {channels.map((ch) => (
            <button
              key={ch}
              onClick={() => onChannelChange(ch)}
              className={`
                text-sm transition
                ${
                  selectedChannel === ch
                    ? "text-blue-500 font-bold underline underline-offset-4"
                    : "hover:text-white font-semibold"
                }
              `}
            >
              {ch}
            </button>
          ))}
        </div>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`
            text-sm px-3 py-1.5 rounded-md border border-gray-700
            flex items-center gap-2
            transition
            ${
              isRefreshing
                ? "text-gray-500 cursor-not-allowed"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }
          `}
        >
          {isRefreshing && (
            <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          )}
          <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      <div className="flex items-center justify-between mb-3">
        {/* Message types */}
        <div className="flex items-center gap-6 text-gray-300 text-sm">
          <span>Message types:</span>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showInfo}
              onChange={() => setShowInfo((v) => !v)}
              className="w-4 h-4"
            />
            <span>info</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showError}
              onChange={() => setShowError((v) => !v)}
              className="w-4 h-4"
            />
            <span>error</span>
          </label>
        </div>

        {/* Auto-scroll */}
        <div className="flex items-center gap-3 text-sm text-gray-300">
          <span>Auto-scroll</span>
          <button
            onClick={() => setAutoScroll((v) => !v)}
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

      <div
        ref={logContainerRef}
        className="h-64 overflow-y-auto border border-gray-800 rounded-lg p-4 bg-[#11161b]"
      >
        {filteredLogs.length === 0 && (
          <div className="text-gray-500 text-sm italic">No logs.</div>
        )}

        {filteredLogs.map((log, i) => (
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
