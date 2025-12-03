// src/components/control/ProcessRow.tsx
import type { Process } from "../../types/Process";
import { FileText } from "lucide-react";
import type { MouseEvent } from "react";

type ProcessRowProps = {
  process: Process;
  onStart: (name: string) => void;
  onStop: (name: string) => void;
  onSelect: (name: string) => void;
  isSelected: boolean;
};

export default function ProcessRow({
  process,
  onStart,
  onStop,
  onSelect,
  isSelected,
}: ProcessRowProps) {
  const isRunning = process.status === "up";

  const handleRowClick = (e: MouseEvent<HTMLTableRowElement>) => {
    // don't trigger row-select when clicking buttons
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    onSelect(process.name);
  };

  return (
    <tr
      onClick={handleRowClick}
      className={`
        border-b border-gray-800 text-sm cursor-pointer
        hover:bg-[#151b20] transition
        ${isSelected ? "bg-[#151b20]" : ""}
      `}
    >
      {/* name */}
      <td className="px-2 py-1 font-medium text-white">{process.name}</td>

      {/* host */}
      <td className="px-2 py-1 text-gray-300">{process.host}</td>

      {/* port */}
      <td className="px-2 py-1 text-gray-300">{process.port}</td>

      {/* status */}
      <td className="px-2 py-1">
        <div className="flex items-center gap-1.5">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isRunning ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-gray-300">{process.status}</span>
        </div>
      </td>

      {/* pid */}
      <td className="px-2 py-1 text-gray-300">
        {process.pid ?? "-"}
      </td>

      {/* mem / heap */}
      <td className="px-2 py-1 text-gray-300">
        {process.mem ?? "-"}
      </td>

      {/* log icon */}
      <td className="px-2 py-1 text-gray-300">
        <FileText
          size={16}
          className="cursor-pointer hover:text-white"
        />
      </td>

      {/* action */}
      <td className="px-2 py-1">
        {isRunning ? (
          <button
            onClick={() => onStop(process.name)}
            className="
              px-3 py-0.5 text-xs rounded border
              border-amber-500 text-amber-400
              hover:bg-amber-600 hover:text-black transition
            "
          >
            Stop
          </button>
        ) : (
          <button
            onClick={() => onStart(process.name)}
            className="
              px-3 py-0.5 text-xs rounded border
              border-green-500 text-green-400
              hover:bg-green-600 hover:text-black transition
            "
          >
            Start
          </button>
        )}
      </td>
    </tr>
  );
}
