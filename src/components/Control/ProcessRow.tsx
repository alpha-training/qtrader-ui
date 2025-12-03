// src/components/control/ProcessRow.tsx
import type { Process } from "../../types/Process";
import { FileText } from "lucide-react";

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
  const isUp = process.status === "up";

  return (
    <tr
      className={`text-xs border-t border-gray-800 cursor-pointer ${
        isSelected ? "bg-[#151b20]" : "hover:bg-[#141921]"
      }`}
      onClick={() => onSelect(process.name)}
    >
      {/* name */}
      <td className="px-2 py-1 whitespace-nowrap">{process.name}</td>

      {/* host */}
      <td className="px-2 py-1 whitespace-nowrap text-gray-300">
        {process.host}
      </td>

      {/* port */}
      <td className="px-2 py-1 whitespace-nowrap text-gray-300">
        {process.port ?? "-"}
      </td>

      {/* status */}
      <td className="px-2 py-1 whitespace-nowrap">
        <span className="inline-flex items-center gap-1">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              isUp ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-gray-200">
            {isUp ? "up" : "down"}
          </span>
        </span>
      </td>

      {/* pid */}
      <td className="px-2 py-1 whitespace-nowrap text-gray-300">
        {process.pid ?? "-"}
      </td>

      {/* mem/heap */}
      <td className="px-2 py-1 whitespace-nowrap text-gray-300">
        {process.mem ?? "-"}
      </td>

      {/* log icon */}
      <td className="px-2 py-1 whitespace-nowrap">
        <button
          type="button"
          className="inline-flex items-center justify-center w-7 h-7 rounded border border-gray-700 hover:bg-gray-800"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(process.name);
          }}
        >
          <FileText size={12} />
        </button>
      </td>

      {/* action */}
      <td className="px-2 py-1 whitespace-nowrap">
        {isUp ? (
          <button
            type="button"
            className="px-2 py-0.5 text-[11px] rounded border border-amber-500 text-amber-400 hover:bg-amber-900/40"
            onClick={(e) => {
              e.stopPropagation();
              onStop(process.name);
            }}
          >
            Stop
          </button>
        ) : (
          <button
            type="button"
            className="px-2 py-0.5 text-[11px] rounded border border-green-500 text-green-400 hover:bg-green-900/40"
            onClick={(e) => {
              e.stopPropagation();
              onStart(process.name);
            }}
          >
            Start
          </button>
        )}
      </td>
    </tr>
  );
}
