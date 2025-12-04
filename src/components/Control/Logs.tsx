// src/components/control/Logs.tsx
import { useEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import LogEntry from "./LogEntry";

import { useLogsStore } from "../../store/logsStore";
import { useProcessStore } from "../../store/processStore";
import { mockApi } from "../../api/mockApi";

type LogsProps = {
  selectedChannel: string;
  onChannelChange: (ch: string) => void;
};

export default function Logs({ selectedChannel, onChannelChange }: LogsProps) {
  const logs = useLogsStore((s) => s.logs);
  const pushLog = useLogsStore((s) => s.pushLog);

  const selectedProcess = useProcessStore((s) => s.selectedProcess);
  const setSelectedProcess = useProcessStore((s) => s.setSelectedProcess);

  const [showInfo, setShowInfo] = useState(true);
  const [showError, setShowError] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const logRef = useRef<HTMLDivElement>(null);

  // -------------------------------
  // INITIAL LOAD FROM API
  // -------------------------------
  useEffect(() => {
    async function load() {
      const items = await mockApi.getLogs();
      items.forEach((l) => pushLog(l));
    }
    load();
  }, [pushLog]);

  // -------------------------------
  // SYNC ROW CLICK → TAB CHANGE
  // -------------------------------
  useEffect(() => {
    if (selectedProcess && selectedProcess !== selectedChannel) {
      onChannelChange(selectedProcess);
    }
  }, [selectedProcess]);

  // -------------------------------
  // BUILD CHANNEL LIST
  // -------------------------------
  const unique = Array.from(new Set(logs.map((l) => l.channel))).sort();
  const channels = ["All", ...unique];

  // -------------------------------
  // FILTERS
  // -------------------------------
  const filtered = logs.filter((log) => {
    const matchChannel =
      selectedChannel === "All" || log.channel === selectedChannel;
    const matchLevel =
      (log.level === "INFO" && showInfo) ||
      (log.level === "ERROR" && showError);
    return matchChannel && matchLevel;
  });

  // -------------------------------
  // AUTO-SCROLL
  // -------------------------------
  useEffect(() => {
    if (autoScroll && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [filtered, autoScroll]);

  // -------------------------------
  // REFRESH MANUALLY
  // -------------------------------
  const refreshLogs = async () => {
    setIsRefreshing(true);

    const stamp = new Date().toLocaleTimeString("en-GB");
    pushLog({
      timestamp: stamp,
      level: "INFO",
      channel: selectedChannel === "All" ? "system" : selectedChannel,
      message: "Manual refresh",
    });

    setTimeout(() => setIsRefreshing(false), 500);
  };

  // -------------------------------
  // TAB CLICK
  // -------------------------------
  const handleTab = (ch: string) => {
    onChannelChange(ch);
    if (ch !== "All") setSelectedProcess(ch);
  };

  return (
    <div className="mt-4">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-semibold">Logs:</h2>

        <button
          onClick={refreshLogs}
          disabled={isRefreshing}
          className={`
            px-2 py-0.5 text-xs flex items-center gap-1 rounded-sm border border-gray-600
            hover:bg-gray-700 transition
            ${isRefreshing ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <RotateCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-4 text-gray-400 mb-3">
        {channels.map((ch) => {
          const active = selectedChannel === ch;
          return (
            <button
              key={ch}
              onClick={() => handleTab(ch)}
              className={`
                text-xs transition
                ${active
                  ? "text-blue-400 font-semibold underline underline-offset-4"
                  : "text-gray-400 hover:text-white"}
              `}
            >
              {ch}
            </button>
          );
        })}
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-4 text-gray-300 mb-2">

        <label className="flex items-center gap-1 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={showInfo}
            onChange={(e) => setShowInfo(e.target.checked)}
          />
          info
        </label>

        <label className="flex items-center gap-1 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={showError}
            onChange={(e) => setShowError(e.target.checked)}
          />
          error
        </label>

        <div className="ml-auto flex items-center gap-1 text-xs">
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
                absolute w-3.5 h-3.5 top-0.5 bg-white rounded-full transition
                ${autoScroll ? "left-5" : "left-0.5"}
              `}
            />
          </button>
        </div>

      </div>

      {/* LOG WINDOW */}
      <div
        ref={logRef}
        className="h-64 overflow-y-auto border border-gray-800 rounded-md p-2 bg-[#11161b]"
      >
        {filtered.length === 0 ? (
          <div className="text-gray-500 text-xs italic">No logs.</div>
        ) : (
          filtered.map((log, i) => <LogEntry key={i} {...log} />)
        )}
      </div>
    </div>
  );
}
