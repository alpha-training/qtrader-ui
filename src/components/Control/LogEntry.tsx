import type { LogEntry as LogEntryType } from "../../store/logsStore";

export default function LogEntry({
  timestamp,
  level,
  message,
  channel,
}: LogEntryType) {
  const color =
    level === "ERROR" ? "text-red-400" : "text-blue-400";

  return (
    <div className="whitespace-pre text-gray-200 font-mono text-xs">
      [{timestamp}]{" "}
      <span className={color}>[{level}]</span>{" "}
      {message}{" "}
      <span className="text-gray-500">({channel})</span>
    </div>
  );
}
