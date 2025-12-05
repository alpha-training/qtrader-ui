// src/components/control/LogEntry.tsx

import type { LogEntry as LogEntryType } from "../../types/LogEntry";

type LogEntryProps = LogEntryType;

export default function LogEntry({
  timestamp,
  level,
  message,
  channel,
}: LogEntryProps) {
  const levelColor =
    level === "ERROR" ? "text-red-400" : "text-blue-400";

  return (
    <div className="whitespace-pre text-gray-200 font-mono text-xs">
      [{timestamp}]{" "}
      <span className={levelColor}>[{level}]</span>{" "}
      <span className="text-gray-400">[{channel}]</span>{" "}
      {message}
    </div>
  );
}
