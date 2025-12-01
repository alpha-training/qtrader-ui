import type { Process } from "../../types/Process";
import { FileText } from "lucide-react";

type ProcessRowProps = {
  process: Process;
  onStart: (name: string) => void;
  onStop: (name: string) => void;
  onSelect: (name: string) => void;
  isLoading: boolean;
};

export default function ProcessRow({
  process,
  onStart,
  onStop,
  onSelect,
  isLoading,
}: ProcessRowProps) {
  const isRunning = process.status === "up";

  const handleRowClick = () => {
    onSelect(process.name);
  };

  return (
    <tr
      className="border-b border-gray-800 hover:bg-[#151b20] transition cursor-pointer animate-fadeIn"
      onClick={handleRowClick}
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
        <FileText
          size={18}
          className="cursor-pointer hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(process.name);
          }}
        />
      </td>

      <td className="px-4 py-3">
        {isRunning ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStop(process.name);
            }}
            disabled={isLoading}
            className={`border px-4 py-1 rounded-md transition
              ${
                isLoading
                  ? "border-orange-900 text-orange-700 cursor-not-allowed"
                  : "border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-black"
              }`}
          >
            {isLoading ? "..." : "Stop"}
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStart(process.name);
            }}
            disabled={isLoading}
            className={`border px-4 py-1 rounded-md transition
              ${
                isLoading
                  ? "border-green-900 text-green-700 cursor-not-allowed"
                  : "border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
              }`}
          >
            {isLoading ? "..." : "Start"}
          </button>
        )}
      </td>
    </tr>
  );
}
