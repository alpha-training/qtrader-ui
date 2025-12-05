// src/components/control/ProcessRow.tsx
import type { Process } from "../../types/Process";
import { FileText } from "lucide-react";

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
  const handleRowClick = () => {
    onSelect(process.name);
  };

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStart(process.name);
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStop(process.name);
  };

  const running = process.status === "up";

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
          onClick={() => onSelect?.(process.name)}
          className="text-gray-400 hover:text-blue-400 transition"
        >
          <FileText size={16} />
        </button>
      </td>

      <td className="px-3 py-1.5">
        {running ? (
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
