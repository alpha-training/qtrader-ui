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
    { name: "tp1",    host: "localhost", port: 5010, status: "up",   pid: 2314, mem: "42 MB / 128 MB" },
    { name: "tp2",    host: "localhost", port: 5011, status: "down", pid: null, mem: null },
    { name: "rdb1",   host: "localhost", port: 5020, status: "up",   pid: 3516, mem: "64 MB / 256 MB" },
    { name: "rdb2",   host: "localhost", port: 5021, status: "up",   pid: 3620, mem: "71 MB / 256 MB" },
    { name: "wdb1",   host: "localhost", port: 5030, status: "down", pid: null, mem: null },
    { name: "wdb2",   host: "localhost", port: 5031, status: "up",   pid: 4882, mem: "58 MB / 256 MB" },
    { name: "hdb1",   host: "localhost", port: 5040, status: "up",   pid: 2921, mem: "92 MB / 512 MB" },
    { name: "hdb2",   host: "localhost", port: 5041, status: "down", pid: null, mem: null },
    { name: "pxfeed", host: "localhost", port: 5050, status: "up",   pid: 1822, mem: "37 MB / 128 MB" },
    { name: "oms",    host: "localhost", port: 5060, status: "up",   pid: 5781, mem: "120 MB / 512 MB" },
    { name: "risk",   host: "localhost", port: 5070, status: "down", pid: null, mem: null },
    { name: "audit",  host: "localhost", port: 5080, status: "up",   pid: 6142, mem: "18 MB / 64 MB" },
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
  const pageSize = 10;
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
            px-2 py-0.5 text-xs rounded-sm transition border 
            ${allRunning || loadingAll
                ? "border-green-900 text-green-700 cursor-not-allowed"
                : "border-green-600 text-green-400 hover:bg-green-600 hover:text-black"}
          `}
        >
          {loadingAll ? "Starting..." : "Start all"}
        </button>

        <button
          onClick={() => setStopAllOpen(true)}
          disabled={allStopped || loadingAll}
          className={`
            px-2 py-0.5 text-xs rounded-sm border transition
            ${allStopped || loadingAll
                ? "border-orange-900 text-orange-700 cursor-not-allowed"
                : "border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-black"}
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
              <th className="px-2 py-1.5 text-xs">name</th>
              <th className="px-2 py-1.5 text-xs">host</th>
              <th className="px-2 py-1.5 text-xs">port</th>
              <th className="px-2 py-1.5 text-xs">status</th>
              <th className="px-2 py-1.5 text-xs">pid</th>
              <th className="px-2 py-1.5 text-xs">mem/heap</th>
              <th className="px-2 py-1.5 text-xs">log</th>
              <th className="px-2 py-1.5 text-xs">action</th>
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
