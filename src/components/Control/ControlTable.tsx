import { useState } from "react";
import ProcessRow from "./ProcessRow";
import Pagination from "../UI/Pagination";

import ConfirmStopModal from "../UI/ConfirmStopModal";
import ConfirmStartModal from "../UI/ConfirmStartModal";
import ConfirmStartAllModal from "../UI/ConfirmStartAllModal";
import ConfirmStopAllModal from "../UI/ConfirmStopAllModal";

import type { Process } from "../../types/Process";

type ControlTableProps = {
  onSelectChannel: (name: string) => void; // NEW
};

export default function ControlTable({ onSelectChannel }: ControlTableProps) {
  const [processes, setProcesses] = useState<Process[]>([
    { name: "tp1", host: "localhost", port: 5010, status: "down", pid: null, mem: null },
    { name: "rdb1", host: "localhost", port: 5011, status: "down", pid: null, mem: null },
    { name: "wdb1", host: "localhost", port: 5012, status: "down", pid: null, mem: null },
    { name: "hdb1", host: "localhost", port: 5013, status: "up", pid: 3516, mem: "64 kB / 128 kB" },
    { name: "start1", host: "localhost", port: 5014, status: "down", pid: null, mem: null },
  ]);

  const [stopModalOpen, setStopModalOpen] = useState(false);
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);

  // Loading state for individual row buttons
  const [loadingProcess, setLoadingProcess] = useState<string | null>(null);

  // Start/Stop all modals
  const [startAllOpen, setStartAllOpen] = useState(false);
  const [stopAllOpen, setStopAllOpen] = useState(false);

  // ALL loading
  const [loadingAll, setLoadingAll] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(processes.length / pageSize);
  const paginated = processes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // -------------------------
  // SINGLE PROCESS ACTIONS
  // -------------------------

  const handleStart = (name: string) => {
    setSelectedProcess(name);
    setStartModalOpen(true);
  };

  const handleStop = (name: string) => {
    setSelectedProcess(name);
    setStopModalOpen(true);
  };

  const confirmStart = () => {
    if (!selectedProcess) return;

    setLoadingProcess(selectedProcess);

    setTimeout(() => {
      setProcesses(prev =>
        prev.map(p =>
          p.name === selectedProcess
            ? { ...p, status: "up", pid: Math.floor(Math.random() * 5000) }
            : p
        )
      );
      setLoadingProcess(null);
      setStartModalOpen(false);
      setSelectedProcess(null);
    }, 600);
  };

  const confirmStop = () => {
    if (!selectedProcess) return;

    setLoadingProcess(selectedProcess);

    setTimeout(() => {
      setProcesses(prev =>
        prev.map(p =>
          p.name === selectedProcess ? { ...p, status: "down", pid: null } : p
        )
      );
      setLoadingProcess(null);
      setStopModalOpen(false);
      setSelectedProcess(null);
    }, 600);
  };

  // -------------------------
  // START / STOP ALL
  // -------------------------

  const confirmStartAll = () => {
    setLoadingAll(true);

    setTimeout(() => {
      setProcesses(prev =>
        prev.map(p =>
          p.status === "down"
            ? { ...p, status: "up", pid: Math.floor(Math.random() * 5000) }
            : p
        )
      );
      setStartAllOpen(false);
      setLoadingAll(false);
    }, 800);
  };

  const confirmStopAll = () => {
    setLoadingAll(true);

    setTimeout(() => {
      setProcesses(prev =>
        prev.map(p =>
          p.status === "up" ? { ...p, status: "down", pid: null } : p
        )
      );
      setStopAllOpen(false);
      setLoadingAll(false);
    }, 800);
  };

  const allRunning = processes.every(p => p.status === "up");
  const allStopped = processes.every(p => p.status === "down");

  return (
    <div>
      {/* Top buttons */}
      <div className="flex justify-end mb-4 gap-2">

        <button
          onClick={() => setStartAllOpen(true)}
          disabled={allRunning || loadingAll}
          className={`
            px-4 py-2 rounded-md transition
            ${allRunning || loadingAll
                ? "bg-green-900 text-green-700 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"}
          `}
        >
          {loadingAll ? "Starting..." : "Start all"}
        </button>

        <button
          onClick={() => setStopAllOpen(true)}
          disabled={allStopped || loadingAll}
          className={`
            px-4 py-2 rounded-md transition
            ${allStopped || loadingAll
                ? "bg-orange-900 text-orange-700 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700 text-white"}
          `}
        >
          {loadingAll ? "Stopping..." : "Stop all"}
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
                onSelect={onSelectChannel}
                onStart={handleStart}
                onStop={handleStop}
                isLoading={loadingProcess === p.name}
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
        onPrev={() => setCurrentPage(p => Math.max(1, p - 1))}
        onNext={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
      />
      </div>
      {/* Modals */}
      <ConfirmStopModal
        isOpen={stopModalOpen}
        processName={selectedProcess}
        onClose={() => setStopModalOpen(false)}
        onConfirm={confirmStop}
      />

      <ConfirmStartModal
        isOpen={startModalOpen}
        processName={selectedProcess}
        onClose={() => setStartModalOpen(false)}
        onConfirm={confirmStart}
      />

      <ConfirmStartAllModal
        isOpen={startAllOpen}
        onClose={() => setStartAllOpen(false)}
        onConfirm={confirmStartAll}
      />

      <ConfirmStopAllModal
        isOpen={stopAllOpen}
        onClose={() => setStopAllOpen(false)}
        onConfirm={confirmStopAll}
      />
    </div>
  );
}
