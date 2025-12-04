// src/components/control/ControlTable.tsx
import { useEffect, useState } from "react";
import ProcessRow from "./ProcessRow";
import Pagination from "../UI/Pagination";

import ConfirmStartModal from "../UI/ConfirmStartModal";
import ConfirmStopModal from "../UI/ConfirmStopModal";
import ConfirmStartAllModal from "../UI/ConfirmStartAllModal";
import ConfirmStopAllModal from "../UI/ConfirmStopAllModal";

import { useProcessStore, type Process } from "../../store/processStore";
import { usePrefs } from "../../hooks/usePrefs";
import { mockApi } from "../../api/mockApi";

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
    startOne,
    stopOne,
    startAll,
    stopAll,
    setSelectedProcess,
  } = useProcessStore();

  const {
    confirmStart,
    confirmStop,
    confirmStartAll,
    confirmStopAll,
  } = usePrefs();

  // -------------------------------
  // LOAD PROCESSES FROM API
  // -------------------------------
  useEffect(() => {
    async function load() {
      const list = await mockApi.getProcesses();
      setProcesses(list);
    }
    load();
  }, [setProcesses]);

  // -------------------------------
  // PAGINATION
  // -------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.max(1, Math.ceil(processes.length / pageSize));
  const paginated: Process[] = processes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // -------------------------------
  // MODALS
  // -------------------------------
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [stopModalOpen, setStopModalOpen] = useState(false);
  const [startAllModalOpen, setStartAllModalOpen] = useState(false);
  const [stopAllModalOpen, setStopAllModalOpen] = useState(false);

  // -------------------------------
  // FLAGS
  // -------------------------------
  const allRunning = processes.length > 0 && processes.every((p) => p.status === "up");
  const allStopped = processes.length > 0 && processes.every((p) => p.status === "down");

  // -------------------------------
  // HANDLERS: SINGLE PROCESS
  // -------------------------------
  const handleStart = async (name: string) => {
    setSelectedProcess(name);
    onSelectChannel(name);

    if (confirmStart) {
      setStartModalOpen(true);
      return;
    }

    await mockApi.startProcess(name);
    startOne(name);
  };

  const handleStop = async (name: string) => {
    setSelectedProcess(name);
    onSelectChannel(name);

    if (confirmStop) {
      setStopModalOpen(true);
      return;
    }

    await mockApi.stopProcess(name);
    stopOne(name);
  };

  const confirmStartOne = async () => {
    if (selectedProcess) {
      await mockApi.startProcess(selectedProcess);
      startOne(selectedProcess);
    }
    setStartModalOpen(false);
  };

  const confirmStopOne = async () => {
    if (selectedProcess) {
      await mockApi.stopProcess(selectedProcess);
      stopOne(selectedProcess);
    }
    setStopModalOpen(false);
  };

  // -------------------------------
  // HANDLERS: START/STOP ALL
  // -------------------------------
  const handleStartAll = () => {
    if (confirmStartAll) return setStartAllModalOpen(true);

    mockApi.startAll().then(startAll);
  };

  const handleStopAll = () => {
    if (confirmStopAll) return setStopAllModalOpen(true);

    mockApi.stopAll().then(stopAll);
  };

  const confirmStartAllAction = async () => {
    await mockApi.startAll();
    startAll();
    setStartAllModalOpen(false);
  };

  const confirmStopAllAction = async () => {
    await mockApi.stopAll();
    stopAll();
    setStopAllModalOpen(false);
  };

  return (
    <div className="mb-4">

      {/* HEADER BUTTONS */}
      <div className="flex justify-end gap-2 mb-2">
        <button
          onClick={handleStartAll}
          disabled={allRunning}
          className={`
            px-2 py-0.5 text-xs rounded-sm border transition
            ${allRunning
              ? "border-gray-700 text-gray-500 cursor-not-allowed opacity-40"
              : "border-green-600 text-green-400 hover:bg-green-600 hover:text-black"}
          `}
        >
          Start all
        </button>

        <button
          onClick={handleStopAll}
          disabled={allStopped}
          className={`
            px-2 py-0.5 text-xs rounded-sm border transition
            ${allStopped
              ? "border-gray-700 text-gray-500 cursor-not-allowed opacity-40"
              : "border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-black"}
          `}
        >
          Stop all
        </button>
      </div>

      {/* TABLE */}
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
                onStart={handleStart}
                onStop={handleStop}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      />

      {/* MODALS */}
      <ConfirmStartModal
        isOpen={startModalOpen}
        processName={selectedProcess}
        onClose={() => setStartModalOpen(false)}
        onConfirm={confirmStartOne}
      />

      <ConfirmStopModal
        isOpen={stopModalOpen}
        processName={selectedProcess}
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
