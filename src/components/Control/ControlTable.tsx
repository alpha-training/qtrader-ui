import { useState } from "react";
import ProcessRow from "./ProcessRow";
import type { Process } from "../../types/Process";

export default function ControlTable() {
  const [processes, setProcesses] = useState<Process[]>([
    {
      name: "tp1",
      host: "localhost",
      port: 5010,
      status: "down",
      pid: null,
      mem: null,
    },
    {
      name: "rdb1",
      host: "localhost",
      port: 5011,
      status: "down",
      pid: null,
      mem: null,
    },
    {
      name: "wdb1",
      host: "localhost",
      port: 5012,
      status: "down",
      pid: null,
      mem: null,
    },
    {
      name: "hdb1",
      host: "localhost",
      port: 5013,
      status: "up",
      pid: 3516,
      mem: "64 kB / 128 kB",
    },
    {
      name: "start1",
      host: "localhost",
      port: 5014,
      status: "down",
      pid: null,
      mem: null,
    },
  ]);

  const startProcess = (name: string) => {
    setProcesses(prev =>
      prev.map(p =>
        p.name === name ? { ...p, status: "up", pid: 1234 } : p
      )
    );
  };

  const stopProcess = (name: string) => {
    setProcesses(prev =>
      prev.map(p =>
        p.name === name ? { ...p, status: "down", pid: null } : p
      )
    );
  };

  return (
    <div>
      {/* Header buttons */}
      <div className="flex justify-end mb-4 gap-2">
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
          Start all
        </button>

        <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md">
          Stop all
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#151b20] text-gray-400">
            <tr>
              <th className="px-4 py-2">name</th>
              <th className="px-4 py-2">host</th>
              <th className="px-4 py-2">port</th>
              <th className="px-4 py-2">status</th>
              <th className="px-4 py-2">pid</th>
              <th className="px-4 py-2">mem/heap</th>
              <th className="px-4 py-2">log</th>
              <th className="px-4 py-2">action</th>
            </tr>
          </thead>

          <tbody>
            {processes.map((proc) => (
              <ProcessRow
                key={proc.name}
                process={proc}
                onStart={startProcess}
                onStop={stopProcess}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
