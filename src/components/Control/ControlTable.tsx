import { useState } from "react";
import ProcessRow from "./ProcessRow";
import Pagination from "../UI/Pagination";
import ConfirmStopModal from "./ConfirmStopModal";
import ConfirmStartModal from "./ConfirmStartModal";
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

  // Stop modal state
  const [stopModalOpen, setStopModalOpen] = useState(false);
  const [selectedStopProcess, setSelectedStopProcess] = useState<string | null>(null);

  // Start modal state
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [selectedStartProcess, setSelectedStartProcess] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(processes.length / pageSize);

  const paginated = processes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // ACTIONS -----------------------------

  // Open Start modal
  const handleStart = (name: string) => {
    setSelectedStartProcess(name);
    setStartModalOpen(true);
  };

  // Apply Start
  const confirmStart = () => {
    if (selectedStartProcess) {
      setProcesses(prev =>
        prev.map(p =>
          p.name === selectedStartProcess
            ? { ...p, status: "up", pid: Math.floor(Math.random() * 5000) }
            : p
        )
      );
    }
    setStartModalOpen(false);
    setSelectedStartProcess(null);
  };

  // Open Stop modal
  const handleStop = (name: string) => {
    setSelectedStopProcess(name);
    setStopModalOpen(true);
  };

  // Apply Stop
  const confirmStop = () => {
    if (selectedStopProcess) {
      setProcesses(prev =>
        prev.map(p =>
          p.name === selectedStopProcess
            ? { ...p, status: "down", pid: null }
            : p
        )
      );
    }
    setStopModalOpen(false);
    setSelectedStopProcess(null);
  };

  // -------------------------------------

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
            {paginated.map((p) => (
              <ProcessRow
                key={p.name}
                process={p}
                onStart={handleStart}
                onStop={handleStop}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
          onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        />
      </div>
      {/* Stop Confirmation Modal */}
      <ConfirmStopModal
        isOpen={stopModalOpen}
        processName={selectedStopProcess}
        onClose={() => setStopModalOpen(false)}
        onConfirm={confirmStop}
      />

      {/* Start Confirmation Modal */}
      <ConfirmStartModal
        isOpen={startModalOpen}
        processName={selectedStartProcess}
        onClose={() => setStartModalOpen(false)}
        onConfirm={confirmStart}
      />
    </div>
  );
}
