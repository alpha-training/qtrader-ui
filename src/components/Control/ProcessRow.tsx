import type { Process } from "../../types/Process";
import { FileText } from "lucide-react";
import Spinner from "../UI/Spinner";

type ProcessRowProps = {
  process: Process;
  onStart: (name: string) => void;
  onStop: (name: string) => void;
  loading: string | null;
  changed: boolean;
};

export default function ProcessRow({
  process,
  onStart,
  onStop,
  loading,
  changed
}: ProcessRowProps) {

  const isRunning = process.status === "up";
  const isLoading = loading === process.name;

  return (
    <tr
      className={`
        border-b border-gray-800 transition
        ${changed ? "bg-[#1a2330] animate-pulse duration-500" : "hover:bg-[#151b20]"}
      `}
    >
      <td className="px-4 py-3 font-medium text-white">{process.name}</td>
      <td className="px-4 py-3 text-gray-300">{process.host}</td>
      <td className="px-4 py-3 text-gray-300">{process.port}</td>

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

      <td className="px-4 py-3 text-gray-300">{process.pid ?? "-"}</td>
      <td className="px-4 py-3 text-gray-300">{process.mem ?? "-"}</td>

      <td className="px-4 py-3 text-gray-300">
        <FileText size={18} className="cursor-pointer hover:text-white" />
      </td>

      <td className="px-4 py-3">
        {isLoading ? (
          <div className="flex justify-center"><Spinner /></div>
        ) : isRunning ? (
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
