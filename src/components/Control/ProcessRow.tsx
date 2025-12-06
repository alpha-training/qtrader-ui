// src/components/control/ProcessRow.tsx
import type { MouseEvent } from "react";
import type { Process } from "../../types/Process";
import { FileText } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useProcessStore } from "../../store/processStore";

type ProcessRowProps = {
  process: Process;
  isSelected: boolean;
  onSelect: (name: string) => void;
  onStart: (name: string) => void;
  onStop: (name: string) => void;
};

export default function ProcessRow({
  process,
  isSelected,
  onSelect,
  onStart,
  onStop,
}: ProcessRowProps) {
  const pending = useProcessStore((s) => s.pending[process.name]);
  const running = process.status === "up";

  const handleRowClick = () => onSelect(process.name);

  const handleStart = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onStart(process.name);
  };

  const handleStop = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onStop(process.name);
  };

  const handleLogClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onSelect(process.name);
  };

  const isPending = !!pending;

  return (
    <tr
      className={`
        cursor-pointer border-t border-gray-800
        ${isSelected ? "bg-[#141b23]" : "hover:bg-[#10151b]"}
      `}
      onClick={handleRowClick}
    >
      <td className="px-3 py-1.5">{process.name}</td>
      <td className="px-3 py-1.5">{process.host}</td>
      <td className="px-3 py-1.5">{process.port}</td>

      <td className="px-3 py-1.5">
        <span
          className={`
            inline-flex items-center gap-1
            ${running ? "text-green-400" : "text-red-400"}
          `}
        >
          <span
            className={`
              inline-block w-2 h-2 rounded-full
              ${running ? "bg-green-500" : "bg-red-500"}
            `}
          />
          {running ? "up" : "down"}
        </span>
      </td>

      <td className="px-3 py-1.5">{process.pid ?? "-"}</td>
      <td className="px-3 py-1.5">{process.mem ?? "-"}</td>

      <td className="px-3 py-1.5">
        <button
          onClick={handleLogClick}
          className="text-gray-400 hover:text-blue-400 transition"
        >
          <FileText size={16} />
        </button>
      </td>

      <td className="px-3 py-1.5">
        {/* If process is pending: show spinner */}
        {isPending ? (
          <button
            disabled
            className="px-2 py-0.5 text-xs rounded-sm border border-gray-600 text-gray-400 opacity-60 cursor-not-allowed flex items-center gap-1"
          >
            <Loader2 size={14} className="animate-spin" />
            {pending === "start" ? "Starting..." : "Stopping..."}
          </button>
        ) : running ? (
          <button
            onClick={handleStop}
            className="px-2 py-0.5 text-xs rounded-sm border border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-black"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="px-2 py-0.5 text-xs rounded-sm border border-green-600 text-green-400 hover:bg-green-600 hover:text-black"
          >
            Start
          </button>
        )}
      </td>
    </tr>
  );
}
