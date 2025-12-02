export type LogEntryProps = {
  timestamp: string;
  level: "INFO" | "ERROR" | "info" | "error";
  message: string;
};
  
  export default function LogEntry({ timestamp, level, message }: LogEntryProps) {
    const color =
      level === "INFO"
        ? "text-blue-400"
        : level === "ERROR"
        ? "text-red-400"
        : "text-gray-300";
  
    return (
      <div className="font-mono text-sm text-gray-200">
        <span className="text-gray-400">[{timestamp}] </span>
        <span className={color}>[{level}]</span>{" "}
        <span className="text-gray-200">{message}</span>
      </div>
    );
  }
  