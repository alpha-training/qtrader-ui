// src/components/control/ControlTable.tsx
import { useEffect, useState } from "react";

import ProcessRow from "./ProcessRow";
import Pagination from "../UI/Pagination";

import ConfirmStartModal from "../UI/ConfirmStartModal";
import ConfirmStopModal from "../UI/ConfirmStopModal";
import ConfirmStartAllModal from "../UI/ConfirmStartAllModal";
import ConfirmStopAllModal from "../UI/ConfirmStopAllModal";

import { useProcessStore } from "../../store/processStore";
import { usePrefs } from "../../hooks/usePrefs";
import { fetchProcesses } from "../../api/processes";

type ControlTableProps = {
  selectedChannel: string;
  onSelectChannel: (channel: string) => void;
};

export default function ControlTable({
  selectedChannel,
  onSelectChannel,
}: ControlTableProps) {
  const {
    processes,
    selectedProcess,
    setProcesses,
    setSelectedProcess,
    startOne,
    stopOne,
    startAll,
    stopAll,
  } = useProcessStore();

  const {
    confirmStart,
    confirmStop,
    confirmStartAll,
    confirmStopAll,
  } = usePrefs();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.max(
    1,
    Math.ceil(processes.length / pageSize)
  );

  const paginated = processes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Modals
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [stopModalOpen, setStopModalOpen] = useState(false);
  const [startAllModalOpen, setStartAllModalOpen] = useState(false);
  const [stopAllModalOpen, setStopAllModalOpen] = useState(false);

  // Derived flags
  const allRunning =
    processes.length > 0 &&
    processes.every((p) => p.status === "up");

  const allStopped =
    processes.length > 0 &&
    processes.every((p) => p.status === "down");

  // Load processes from API 
  useEffect(() => {
    let alive = true;
  
    async function load() {
      try {
        const items = await fetchProcesses();
        if (alive) setProcesses(items);
      } catch (err) {
        console.error("Failed to load processes", err);
      }
    }
  
    load();
    const id = window.setInterval(load, 3000);
  
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [setProcesses]);
  
  // Row selection
  const handleRowSelect = (name: string) => {
    setSelectedProcess(name);

    // sync with Logs tabs
    if (selectedChannel !== name) {
      onSelectChannel(name);
    }
  };

  // Single row start/stop
  const handleStart = (name: string) => {
    setSelectedProcess(name);

    if (confirmStart) {
      setStartModalOpen(true);
    } else {
      startOne(name);
    }
  };

  const handleStop = (name: string) => {
    setSelectedProcess(name);

    if (confirmStop) {
      setStopModalOpen(true);
    } else {
      stopOne(name);
    }
  };

  const confirmStartOne = () => {
    if (selectedProcess) {
      startOne(selectedProcess);
    }
    setStartModalOpen(false);
  };

  const confirmStopOne = () => {
    if (selectedProcess) {
      stopOne(selectedProcess);
    }
    setStopModalOpen(false);
  };

  // All processes
  const handleStartAll = () => {
    if (confirmStartAll) {
      setStartAllModalOpen(true);
    } else {
      startAll();
    }
  };

  const handleStopAll = () => {
    if (confirmStopAll) {
      setStopAllModalOpen(true);
    } else {
      stopAll();
    }
  };

  const confirmStartAllAction = () => {
    startAll();
    setStartAllModalOpen(false);
  };

  const confirmStopAllAction = () => {
    stopAll();
    setStopAllModalOpen(false);
  };

  return (
    <div className="mb-4">
      {/* header buttons */}
      <div className="flex justify-end gap-2 mb-2">
        <button
          onClick={handleStartAll}
          disabled={allRunning}
          className={`
            px-2 py-0.5 text-xs rounded-sm border transition
            ${
              allRunning
                ? "border-gray-700 text-gray-500 cursor-not-allowed opacity-40"
                : "border-green-600 text-green-400 hover:bg-green-600 hover:text-black"
            }
          `}
        >
          Start all
        </button>

        <button
          onClick={handleStopAll}
          disabled={allStopped}
          className={`
            px-2 py-0.5 text-xs rounded-sm border transition
            ${
              allStopped
                ? "border-gray-700 text-gray-500 cursor-not-allowed opacity-40"
                : "border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-black"
            }
          `}
        >
          Stop all
        </button>
      </div>

      {/* table */}
      <div className="border border-gray-800 rounded-md overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-[#151b20] text-gray-400">
            <tr>
              <th className="px-3 py-1.5 text-left">name</th>
              <th className="px-3 py-1.5 text-left">host</th>
              <th className="px-3 py-1.5 text-left">port</th>
              <th className="px-3 py-1.5 text-left">status</th>
              <th className="px-3 py-1.5 text-left">pid</th>
              <th className="px-3 py-1.5 text-left">mem/heap</th>
              <th className="px-3 py-1.5 text-left">log</th>
              <th className="px-3 py-1.5 text-left">action</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((p) => (
              <ProcessRow
                key={p.name}
                process={p}
                isSelected={selectedProcess === p.name}
                onSelect={handleRowSelect}
                onStart={handleStart}
                onStop={handleStop}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() =>
          setCurrentPage((p) => Math.max(1, p - 1))
        }
        onNext={() =>
          setCurrentPage((p) => Math.min(totalPages, p + 1))
        }
      />

      {/* modals */}
      <ConfirmStartModal
        isOpen={startModalOpen}
        processName={selectedProcess ?? ""}
        onClose={() => setStartModalOpen(false)}
        onConfirm={confirmStartOne}
      />

      <ConfirmStopModal
        isOpen={stopModalOpen}
        processName={selectedProcess ?? ""}
        onClose={() => setStopModalOpen(false)}
        onConfirm={confirmStopOne}
      />

      <ConfirmStartAllModal
        isOpen={startAllModalOpen}
        onClose={() => setStartAllModalOpen(false)}
        onConfirm={confirmStartAllAction}
      />

      <ConfirmStopAllModal
        isOpen={stopAllModalOpen}
        onClose={() => setStopAllModalOpen(false)}
        onConfirm={confirmStopAllAction}
      />
    </div>
  );
}
