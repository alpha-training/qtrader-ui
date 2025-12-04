// src/components/control/ControlTable.tsx
import { useEffect, useState } from "react";
import ProcessRow from "./ProcessRow";
import Pagination from "../UI/Pagination";
import ConfirmStartModal from "../UI/ConfirmStartModal";
import ConfirmStopModal from "../UI/ConfirmStopModal";
import ConfirmStartAllModal from "../UI/ConfirmStartAllModal";
import ConfirmStopAllModal from "../UI/ConfirmStopAllModal";
import { usePrefs } from "../../hooks/usePrefs";
import { useProcessStore } from "../../store/processStore";
import type { Process } from "../../types/Process";

type ControlTableProps = {
  selectedChannel: string;
  onSelectChannel: (name: string) => void;
};

export default function ControlTable({
  selectedChannel,
  onSelectChannel,
}: ControlTableProps) {
  const processes = useProcessStore((s) => s.processes);
  const initMock = useProcessStore((s) => s.initMock);
  const startProcess = useProcessStore((s) => s.startProcess);
  const stopProcess = useProcessStore((s) => s.stopProcess);
  const startAllStore = useProcessStore((s) => s.startAll);
  const stopAllStore = useProcessStore((s) => s.stopAll);

  const { prefs } = usePrefs();

  // selected row for highlight
  const [selectedName, setSelectedName] = useState<string | null>(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // modals
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [stopModalOpen, setStopModalOpen] = useState(false);
  const [startAllModalOpen, setStartAllModalOpen] = useState(false);
  const [stopAllModalOpen, setStopAllModalOpen] = useState(false);
  const [pendingProcess, setPendingProcess] = useState<string | null>(null);

  // ensure mock data loaded once
  useEffect(() => {
    if (!processes || processes.length === 0) {
      initMock();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // pagination helpers
  const totalPages = Math.max(
    1,
    Math.ceil((processes?.length || 0) / pageSize)
  );

  const pageProcesses: Process[] = processes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const allRunning = processes.length > 0 && processes.every((p) => p.status === "up");
  const allStopped = processes.length > 0 && processes.every((p) => p.status === "down");

  // row selection -> also drives logs channel
  const handleSelectRow = (name: string) => {
    setSelectedName(name);
    onSelectChannel(name);
  };

  // single start/stop click
  const handleStartClick = (name: string) => {
    if (prefs.confirmStart) {
      setPendingProcess(name);
      setStartModalOpen(true);
    } else {
      startProcess(name);
    }
  };

  const handleStopClick = (name: string) => {
    if (prefs.confirmStop) {
      setPendingProcess(name);
      setStopModalOpen(true);
    } else {
      stopProcess(name);
    }
  };

  // confirm handlers
  const confirmStart = () => {
    if (pendingProcess) startProcess(pendingProcess);
    setStartModalOpen(false);
    setPendingProcess(null);
  };

  const confirmStop = () => {
    if (pendingProcess) stopProcess(pendingProcess);
    setStopModalOpen(false);
    setPendingProcess(null);
  };

  const handleStartAll = () => {
    if (prefs.confirmStartAll) {
      setStartAllModalOpen(true);
    } else {
      startAllStore();
    }
  };

  const handleStopAll = () => {
    if (prefs.confirmStopAll) {
      setStopAllModalOpen(true);
    } else {
      stopAllStore();
    }
  };

  const confirmStartAll = () => {
    startAllStore();
    setStartAllModalOpen(false);
  };

  const confirmStopAll = () => {
    stopAllStore();
    setStopAllModalOpen(false);
  };

  return (
    <div className="mb-6">
      {/* header buttons */}
      <div className="flex justify-end mb-3 gap-2">
      <button
        onClick={handleStartAll}
        disabled={allRunning}
        className={`
          px-2 py-0.5 text-xs rounded-sm transition
          border border-green-600 
          ${allRunning
            ? "text-green-700 cursor-not-allowed opacity-40"
            : "text-green-400 hover:bg-green-600/20"}
        `}
      >
        Start all
      </button>

      <button
        onClick={handleStopAll}
        disabled={allStopped}
        className={`
          px-2 py-0.5 text-xs rounded-sm transition
          border border-orange-600 
          ${allStopped
            ? "text-orange-700 cursor-not-allowed opacity-40"
            : "text-orange-400 hover:bg-orange-600/20"}
        `}
      >
        Stop all
      </button>

      </div>

      {/* table */}
      <div className="overflow-hidden rounded-lg border border-gray-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#151b20] text-gray-400">
            <tr>
              <th className="px-2 py-0.5">name</th>
              <th className="px-2 py-0.5">host</th>
              <th className="px-2 py-0.5">port</th>
              <th className="px-2 py-0.5">status</th>
              <th className="px-2 py-0.5">pid</th>
              <th className="px-2 py-0.5">mem/heap</th>
              <th className="px-2 py-0.5">log</th>
              <th className="px-2 py-0.5">action</th>
            </tr>
          </thead>
          <tbody>
            {pageProcesses.map((p) => (
              <ProcessRow
                key={p.name}
                process={p}
                isSelected={selectedName === p.name}
                onSelect={() => handleSelectRow(p.name)}
                onStart={() => handleStartClick(p.name)}
                onStop={() => handleStopClick(p.name)}
              />
            ))}

            {pageProcesses.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-6 text-center text-gray-500 text-sm"
                >
                  No processes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="flex justify-end">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      />
    </div>    
      {/* modals */}
      <ConfirmStartModal
        isOpen={startModalOpen}
        processName={pendingProcess}
        onClose={() => setStartModalOpen(false)}
        onConfirm={confirmStart}
      />

      <ConfirmStopModal
        isOpen={stopModalOpen}
        processName={pendingProcess}
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
