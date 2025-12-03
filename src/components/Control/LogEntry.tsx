type LogEntryProps = {
  timestamp: string;
  level: "INFO" | "ERROR";        // <-- must match your logs level values
  message: string;
  channel: string;
};

export default function LogEntry({ timestamp, level, message }: LogEntryProps) {
  const color =
    level === "ERROR"
      ? "text-red-400"
      : "text-blue-400";

  return (
    <div className="whitespace-pre text-gray-200 text-xs font-mono">
      [{timestamp}] <span className={color}>[{level}]</span> {message}
    </div>
  );
}
