import { useState } from "react";
import LogEntry from "./LogEntry";

const channels = ["All", "tp1", "rdb1", "wdb1", "hdb1", "start1"];

const mockLogs = [
  { timestamp: "17:56:26", level: "INFO", message: "heartbeat ok", channel: "rdb1" },
  { timestamp: "17:56:27", level: "INFO", message: "processing trades...", channel: "rdb1" },
  { timestamp: "17:56:26", level: "ERROR", message: "connection lost", channel: "rdb1" },
  { timestamp: "17:56:26", level: "INFO", message: "heartbeat ok", channel: "wdb1" },
  { timestamp: "17:56:27", level: "INFO", message: "processing trades...", channel: "tp1" },
];

export default function Logs() {
  const [selectedChannel, setSelectedChannel] = useState("rdb1");
  const [showInfo, setShowInfo] = useState(true);
  const [showError, setShowError] = useState(true);

  const filteredLogs = mockLogs.filter((log) => {
    const channelMatches =
      selectedChannel === "All" || log.channel === selectedChannel;

    const levelMatches =
      (log.level === "INFO" && showInfo) ||
      (log.level === "ERROR" && showError);

    return channelMatches && levelMatches;
  });

  return (
    <div className="mt-10">
      {/* Title */}
      <h2 className="text-xl font-semibold mb-4">Logs:</h2>

      {/* Tabs */}
      <div className="flex items-center gap-6 text-gray-400 mb-4">
        {channels.map((ch) => (
          <span
            key={ch}
            className={`cursor-pointer hover:text-white ${
              selectedChannel === ch ? "text-white font-medium" : ""
            }`}
            onClick={() => setSelectedChannel(ch)}
          >
            {ch}
          </span>
        ))}
      </div>

      {/* Filters */}
      <div className="text-gray-300 mb-3 flex items-center gap-4">
        <span className="text-sm">Message types:</span>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showInfo}
            onChange={(e) => setShowInfo(e.target.checked)}
            className="w-4 h-4 border-gray-600 bg-transparent"
          />
          <span className="text-sm">info</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showError}
            onChange={(e) => setShowError(e.target.checked)}
            className="w-4 h-4 border-gray-600 bg-transparent"
          />
          <span className="text-sm">error</span>
        </label>
      </div>

      {/* Log window */}
      <div className="h-64 overflow-y-auto border border-gray-800 rounded-lg p-4 bg-[#11161b]">
        {filteredLogs.map((log, i) => (
          <LogEntry
            key={i}
            timestamp={log.timestamp}
            level={log.level as "INFO" | "ERROR"}
            message={log.message}
          />
        ))}

        {filteredLogs.length === 0 && (
          <div className="text-gray-500 text-smitalic">No logs.</div>
        )}
      </div>
    </div>
  );
}
