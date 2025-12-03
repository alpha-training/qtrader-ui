// src/components/control/ControlTable.tsx
import { useState } from "react";
import ProcessRow from "./ProcessRow";
import Pagination from "../UI/Pagination";

import ConfirmStartModal from "../UI/ConfirmStartModal";
import ConfirmStopModal from "../UI/ConfirmStopModal";
import ConfirmStartAllModal from "../UI/ConfirmStartAllModal";
import ConfirmStopAllModal from "../UI/ConfirmStopAllModal";
import { usePrefs } from "../../hooks/usePrefs";
import { useProcesses } from "../../context/ProcessContext";

type ControlTableProps = {
  selectedChannel: string;
  onSelectChannel: (name: string) => void;
};

export default function ControlTable({
  selectedChannel,
  onSelectChannel,
}: ControlTableProps) {
  const { prefs } = usePrefs();
  const { processes, setProcesses } = useProcesses();

  // modals
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [stopModalOpen, setStopModalOpen] = useState(false);
  const [startAllModalOpen, setStartAllModalOpen] = useState(false);
  const [stopAllModalOpen, setStopAllModalOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(processes.length / pageSize) || 1;

  const paginated = processes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // helpers
  const startProcess = (name: string) => {
    setProcesses(prev =>
      prev.map(p =>
        p.name === name
          ? {
              ...p,
              status: "up",
              pid: p.pid ?? Math.floor(1000 + Math.random() * 9000),
            }
          : p
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

  const startAllProcesses = () => {
    setProcesses(prev =>
      prev.map(p =>
        p.status === "down"
          ? {
              ...p,
              status: "up",
              pid: p.pid ?? Math.floor(1000 + Math.random() * 9000),
            }
          : p
      )
    );
  };

  const stopAllProcesses = () => {
    setProcesses(prev =>
      prev.map(p =>
        p.status === "up" ? { ...p, status: "down", pid: null } : p
      )
    );
  };

  const allRunning = processes.length > 0 && processes.every(p => p.status === "up");
  const allStopped = processes.length > 0 && processes.every(p => p.status === "down");

  // handlers (prefs)
  const handleStart = (name: string) => {
    if (prefs.confirmStart) {
      setSelectedProcess(name);
      setStartModalOpen(true);
    } else {
      startProcess(name);
    }
  };

  const handleStop = (name: string) => {
    if (prefs.confirmStop) {
      setSelectedProcess(name);
      setStopModalOpen(true);
    } else {
      stopProcess(name);
    }
  };

  const handleStartAll = () => {
    if (prefs.confirmStartAll) {
      setStartAllModalOpen(true);
    } else {
      startAllProcesses();
    }
  };

  const handleStopAll = () => {
    if (prefs.confirmStopAll) {
      setStopAllModalOpen(true);
    } else {
      stopAllProcesses();
    }
  };

  const confirmStart = () => {
    if (selectedProcess) startProcess(selectedProcess);
    setStartModalOpen(false);
    setSelectedProcess(null);
  };

  const confirmStop = () => {
    if (selectedProcess) stopProcess(selectedProcess);
    setStopModalOpen(false);
    setSelectedProcess(null);
  };

  const confirmStartAll = () => {
    startAllProcesses();
    setStartAllModalOpen(false);
  };

  const confirmStopAll = () => {
    stopAllProcesses();
    setStopAllModalOpen(false);
  };

  return (
    <div className="mb-6">
      {/* Buttons */}
      <div className="flex justify-end mb-3 gap-2">
        <button
          onClick={handleStartAll}
          disabled={allRunning}
          className={`
            px-3 py-1 text-xs rounded border
            ${
              allRunning
                ? "border-green-900 text-green-700 cursor-not-allowed"
                : "border-green-600 text-green-400 hover:bg-green-900/40"
            }
          `}
        >
          Start all
        </button>

        <button
          onClick={handleStopAll}
          disabled={allStopped}
          className={`
            px-3 py-1 text-xs rounded border
            ${
              allStopped
                ? "border-amber-900 text-amber-700 cursor-not-allowed"
                : "border-amber-600 text-amber-400 hover:bg-amber-900/40"
            }
          `}
        >
          Stop all
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#151b20] text-gray-400 text-xs">
            <tr>
              <th className="px-2 py-1">name</th>
              <th className="px-2 py-1">host</th>
              <th className="px-2 py-1">port</th>
              <th className="px-2 py-1">status</th>
              <th className="px-2 py-1">pid</th>
              <th className="px-2 py-1">mem/heap</th>
              <th className="px-2 py-1">log</th>
              <th className="px-2 py-1">action</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map(p => (
              <ProcessRow
                key={p.name}
                process={p}
                onStart={handleStart}
                onStop={handleStop}
                onSelect={onSelectChannel}
                isSelected={selectedChannel === p.name}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage(p => Math.max(1, p - 1))}
          onNext={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        />
      </div>

      {/* Modals */}
      <ConfirmStartModal
        isOpen={startModalOpen}
        processName={selectedProcess}
        onClose={() => setStartModalOpen(false)}
        onConfirm={confirmStart}
      />

      <ConfirmStopModal
        isOpen={stopModalOpen}
        processName={selectedProcess}
        onClose={() => setStopModalOpen(false)}
        onConfirm={confirmStop}
      />

      <ConfirmStartAllModal
        isOpen={startAllModalOpen}
        onClose={() => setStartAllModalOpen(false)}
        onConfirm={confirmStartAll}
      />

      <ConfirmStopAllModal
        isOpen={stopAllModalOpen}
        onClose={() => setStopAllModalOpen(false)}
        onConfirm={confirmStopAll}
      />
    </div>
  );
}
