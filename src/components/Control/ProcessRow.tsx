// src/components/control/ProcessRow.tsx
import { FileText } from "lucide-react";
import { useProcessStore } from "../../store/processStore";

type Props = {
  process: {
    name: string;
    host: string;
    port: number;
    status: "up" | "down";
    pid: number | null;
    mem: string | null;
  };
  onStart: (name: string) => void;
  onStop: (name: string) => void;
};

export default function ProcessRow({ process, onStart, onStop }: Props) {
  const { selectedProcess, setSelectedProcess } = useProcessStore();

  const isSelected = selectedProcess === process.name;

  return (
    <tr
      className={`
        cursor-pointer transition
        ${isSelected ? "bg-[#1d2730]" : "hover:bg-[#1a2229]"}
      `}
      onClick={() => setSelectedProcess(process.name)}
    >
      <td className="px-3 py-1.5">{process.name}</td>
      <td className="px-3 py-1.5">{process.host}</td>
      <td className="px-3 py-1.5">{process.port}</td>

      <td className="px-3 py-1.5">
        <span
          className={`
            inline-block w-2 h-2 rounded-full mr-2
            ${process.status === "up" ? "bg-green-500" : "bg-red-500"}
          `}
        />
        {process.status}
      </td>

      <td className="px-3 py-1.5">{process.pid ?? "-"}</td>
      <td className="px-3 py-1.5">{process.mem ?? "-"}</td>

      <td className="px-3 py-1.5">
        <FileText size={14} className="text-gray-400" />
      </td>

      <td className="px-3 py-1.5">
        {process.status === "down" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStart(process.name);
            }}
            className="px-2 py-0.5 text-xs border border-green-600 text-green-400 rounded-sm hover:bg-green-600 hover:text-black transition"
          >
            Start
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStop(process.name);
            }}
            className="px-2 py-0.5 text-xs border border-orange-600 text-orange-400 rounded-sm hover:bg-orange-600 hover:text-black transition"
          >
            Stop
          </button>
        )}
      </td>
    </tr>
  );
}
