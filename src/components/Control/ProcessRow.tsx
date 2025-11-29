import type { Process } from "../../types/Process";
import { FileText, Play, Square } from "lucide-react";

type ProcessRowProps = {
  process: Process;
  onStart: (name: string) => void;
  onStop: (name: string) => void;
};

export default function ProcessRow({ process, onStart, onStop }: ProcessRowProps) {
  const isRunning = process.status === "up";

  return (
    <tr className="border-b border-gray-800 hover:bg-[#151b20] transition">
      {/* Name */}
      <td className="px-4 py-3 font-medium text-white">{process.name}</td>

      {/* Host */}
      <td className="px-4 py-3 text-gray-300">{process.host}</td>

      {/* Port */}
      <td className="px-4 py-3 text-gray-300">{process.port}</td>

      {/* Status */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className={`h-3 w-3 rounded-full ${
              isRunning ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="capitalize text-gray-300">{process.status}</span>
        </div>
      </td>

      {/* PID */}
      <td className="px-4 py-3 text-gray-300">
        {process.pid ?? "-"}
      </td>

      {/* Memory */}
      <td className="px-4 py-3 text-gray-300">
        {process.mem ?? "-"}
      </td>

      {/* Log icon */}
      <td className="px-4 py-3 text-gray-300">
        <FileText size={18} className="cursor-pointer hover:text-white" />
      </td>

      {/* Action */}
      <td className="px-4 py-3">
        {isRunning ? (
          <button
            onClick={() => onStop(process.name)}
            className="border border-orange-500 text-orange-400 px-4 py-1 rounded-md hover:bg-orange-500 hover:text-black transition"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={() => onStart(process.name)}
            className="border border-green-500 text-green-400 px-4 py-1 rounded-md hover:bg-green-500 hover:text-black transition"
          >
            Start
          </button>
        )}
      </td>
    </tr>
  );
}
