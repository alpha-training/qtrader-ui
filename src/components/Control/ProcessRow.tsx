// src/components/control/ProcessRow.tsx
import type { Process } from "../../types/Process";
import { FileText } from "lucide-react";

type ProcessRowProps = {
  process: Process;
  isSelected: boolean;
  onSelect: () => void;
  onStart: () => void;
  onStop: () => void;
};

export default function ProcessRow({
  process,
  isSelected,
  onSelect,
  onStart,
  onStop,
}: ProcessRowProps) {
  const isRunning = process.status === "up";

  return (
    <tr
      onClick={onSelect}
      className={`
        border-b border-gray-800 text-sm cursor-pointer
        ${isSelected ? "bg-[#151b20]" : "hover:bg-[#141920]"}
      `}
    >
      {/* name */}
      <td className="px-2 py-0.5 font-medium text-white">{process.name}</td>

      {/* host */}
      <td className="px-2 py-0.5 text-gray-300">{process.host}</td>

      {/* port */}
      <td className="px-2 py-0.5 text-gray-300">{process.port}</td>

      {/* status */}
      <td className="px-2 py-0.5">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isRunning ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-gray-300">{process.status}</span>
        </div>
      </td>

      {/* pid */}
      <td className="px-2 py-0.5 text-gray-300">
        {process.pid != null ? process.pid : "-"}
      </td>

      {/* mem */}
      <td className="px-2 py-0.5 text-gray-300">
        {process.mem != null ? process.mem : "-"}
      </td>

      {/* log icon */}
      <td className="px-2 py-0.5 text-gray-300">
        <FileText size={16} className="cursor-pointer hover:text-white" />
      </td>

      {/* action */}
      <td className="px-2 py-0.5">
        {isRunning ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStop();
            }}
            className="border border-orange-500 text-orange-400 text-xs px-2 py-0.5 rounded-sm hover:bg-orange-500 hover:text-black transition"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
            className="border border-green-500 text-green-400 text-xs px-2 py-0.5 rounded-sm hover:bg-green-500 hover:text-black transition"
          >
            Start
          </button>
        )}
      </td>
    </tr>
  );
}
