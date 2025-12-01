import { useState } from "react";
import ProcessRow from "./ProcessRow";
import Pagination from "../UI/Pagination";

import ConfirmStopModal from "../control/ConfirmStopModal";
import ConfirmStartModal from "../control/ConfirmStartModal";

import ConfirmStartAllModal from "../UI/ConfirmStartAllModal";
import ConfirmStopAllModal from "../UI/ConfirmStopAllModal";

import type { Process } from "../../types/Process";

// -------------------------------------------------------------
// FAKE API WRAPPER — Replace with real backend later
// -------------------------------------------------------------
const fakeApi = <T,>(callback: () => T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(callback()), 600);
  });
};

export default function ControlTable() {
  // -----------------------------------------------------------
  // STATE
  // -----------------------------------------------------------
  const [processes, setProcesses] = useState<Process[]>([
    { name: "tp1", host: "localhost", port: 5010, status: "down", pid: null, mem: null },
    { name: "rdb1", host: "localhost", port: 5011, status: "down", pid: null, mem: null },
    { name: "wdb1", host: "localhost", port: 5012, status: "down", pid: null, mem: null },
    { name: "hdb1", host: "localhost", port: 5013, status: "up", pid: 3516, mem: "64 kB / 128 kB" },
    { name: "start1", host: "localhost", port: 5014, status: "down", pid: null, mem: null },
  ]);

  // Loading state for individual rows
  const [loadingProcess, setLoadingProcess] = useState<string | null>(null);

  // Flash animation per row
  const [flashRows, setFlashRows] = useState<Record<string, boolean>>({});

  // Highlight row after a change
  const flashRow = (name: string) => {
    setFlashRows(prev => ({ ...prev, [name]: true }));
    setTimeout(() => {
      setFlashRows(prev => ({ ...prev, [name]: false }));
    }, 600);
  };

  // -----------------------------------------------------------
  // PAGINATION
  // -----------------------------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(processes.length / pageSize);

  const paginated = processes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // -----------------------------------------------------------
  // MODALS — single process
  // -----------------------------------------------------------
  const [stopModalOpen, setStopModalOpen] = useState(false);
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);

  const handleStart = (name: string) => {
    setSelectedProcess(name);
    setStartModalOpen(true);
  };

  const handleStop = (name: string) => {
    setSelectedProcess(name);
    setStopModalOpen(true);
  };

  // -----------------------------------------------------------
  // CONFIRM Start single
  // -----------------------------------------------------------
  const confirmStart = async () => {
    if (!selectedProcess) return;

    setLoadingProcess(selectedProcess);

    await fakeApi(() => {
      setProcesses(prev =>
        prev.map(p =>
          p.name === selectedProcess
            ? { ...p, status: "up", pid: Math.floor(Math.random() * 5000) }
            : p
        )
      );
    });

    flashRow(selectedProcess);
    setLoadingProcess(null);
    setStartModalOpen(false);
    setSelectedProcess(null);
  };

  // -----------------------------------------------------------
  // CONFIRM Stop single
  // -----------------------------------------------------------
  const confirmStop = async () => {
    if (!selectedProcess) return;

    setLoadingProcess(selectedProcess);

    await fakeApi(() => {
      setProcesses(prev =>
        prev.map(p =>
          p.name === selectedProcess
            ? { ...p, status: "down", pid: null }
            : p
        )
      );
    });

    flashRow(selectedProcess);
    setLoadingProcess(null);
    setStopModalOpen(false);
    setSelectedProcess(null);
  };

  // -----------------------------------------------------------
  // MODALS — ALL PROCESSES
  // -----------------------------------------------------------
  const [startAllOpen, setStartAllOpen] = useState(false);
  const [stopAllOpen, setStopAllOpen] = useState(false);

  const openStartAll = () => setStartAllOpen(true);
  const openStopAll = () => setStopAllOpen(true);

  // -----------------------------------------------------------
  // CONFIRM Start All
  // -----------------------------------------------------------
  const confirmStartAll = async () => {
    await fakeApi(() => {
      setProcesses(prev =>
        prev.map(p =>
          p.status === "down"
            ? { ...p, status: "up", pid: Math.floor(Math.random() * 5000) }
            : p
        )
      );
    });

    processes.forEach(p => flashRow(p.name));
    setStartAllOpen(false);
  };

  // -----------------------------------------------------------
  // CONFIRM Stop All
  // -----------------------------------------------------------
  const confirmStopAll = async () => {
    await fakeApi(() => {
      setProcesses(prev =>
        prev.map(p =>
          p.status === "up" ? { ...p, status: "down", pid: null } : p
        )
      );
    });

    processes.forEach(p => flashRow(p.name));
    setStopAllOpen(false);
  };

  // Disable buttons if all running or all stopped
  const allRunning = processes.every(p => p.status === "up");
  const allStopped = processes.every(p => p.status === "down");

  // -----------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------
  return (
    <div>

      {/* ----------------------------------------------------- */}
      {/* Header buttons                                        */}
      {/* ----------------------------------------------------- */}
      <div className="flex justify-end mb-4 gap-2">

        <button
          onClick={openStartAll}
          disabled={allRunning}
          className={`
            px-4 py-2 rounded-md transition
            ${allRunning 
              ? "bg-green-900 text-green-700 cursor-not-allowed" 
              : "bg-green-600 hover:bg-green-700 text-white"}
          `}
        >
          Start all
        </button>

        <button
          onClick={openStopAll}
          disabled={allStopped}
          className={`
            px-4 py-2 rounded-md transition
            ${allStopped
              ? "bg-orange-900 text-orange-700 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-700 text-white"}
          `}
        >
          Stop all
        </button>
      </div>

      {/* ----------------------------------------------------- */}
      {/* TABLE                                                 */}
      {/* ----------------------------------------------------- */}
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
            {paginated.map(p => (
              <ProcessRow
                key={p.name}
                process={p}
                onStart={handleStart}
                onStop={handleStop}
                loading={loadingProcess}
                changed={flashRows[p.name] ?? false}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* ----------------------------------------------------- */}
      {/* PAGINATION                                            */}
      {/* ----------------------------------------------------- */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage(p => Math.max(1, p - 1))}
        onNext={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
      />

      {/* ----------------------------------------------------- */}
      {/* MODALS — SINGLE PROCESS                               */}
      {/* ----------------------------------------------------- */}
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

      {/* ----------------------------------------------------- */}
      {/* MODALS — ALL PROCESSES                                */}
      {/* ----------------------------------------------------- */}
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
