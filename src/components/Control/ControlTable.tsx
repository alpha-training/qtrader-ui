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

type Props = {
  selectedChannel: string;
  onSelectChannel: (name: string) => void;
};

export default function ControlTable({ selectedChannel, onSelectChannel }: Props) {
  const { prefs } = usePrefs();
  const { processes, start, stop, startAll, stopAll } = useProcesses();

  const [startModalOpen, setStartModalOpen] = useState(false);
  const [stopModalOpen, setStopModalOpen] = useState(false);
  const [startAllModalOpen, setStartAllModalOpen] = useState(false);
  const [stopAllModalOpen, setStopAllModalOpen] = useState(false);

  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);

  const pageSize = 10;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(processes.length / pageSize);

  const visible = processes.slice((page - 1) * pageSize, page * pageSize);

  const handleStart = (name: string) => {
    if (prefs.confirmStart) {
      setSelectedProcess(name);
      setStartModalOpen(true);
    } else start(name);
  };

  const handleStop = (name: string) => {
    if (prefs.confirmStop) {
      setSelectedProcess(name);
      setStopModalOpen(true);
    } else stop(name);
  };

  return (
    <div className="mb-6">
      {/* START/STOP ALL */}
      <div className="flex justify-end mb-3 gap-2">
        <button
          onClick={() =>
            prefs.confirmStartAll
              ? setStartAllModalOpen(true)
              : startAll()
          }
          className="px-3 py-1 text-xs rounded border border-green-600 text-green-400"
        >
          Start all
        </button>

        <button
          onClick={() =>
            prefs.confirmStopAll
              ? setStopAllModalOpen(true)
              : stopAll()
          }
          className="px-3 py-1 text-xs rounded border border-amber-600 text-amber-400"
        >
          Stop all
        </button>
      </div>

      {/* TABLE */}
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
            {visible.map((p) => (
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
          currentPage={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      </div>

      {/* MODALS */}
      <ConfirmStartModal
        isOpen={startModalOpen}
        processName={selectedProcess}
        onConfirm={() => {
          if (selectedProcess) start(selectedProcess);
          setStartModalOpen(false);
        }}
        onClose={() => setStartModalOpen(false)}
      />

      <ConfirmStopModal
        isOpen={stopModalOpen}
        processName={selectedProcess}
        onConfirm={() => {
          if (selectedProcess) stop(selectedProcess);
          setStopModalOpen(false);
        }}
        onClose={() => setStopModalOpen(false)}
      />

      <ConfirmStartAllModal
        isOpen={startAllModalOpen}
        onConfirm={() => {
          startAll();
          setStartAllModalOpen(false);
        }}
        onClose={() => setStartAllModalOpen(false)}
      />

      <ConfirmStopAllModal
        isOpen={stopAllModalOpen}
        onConfirm={() => {
          stopAll();
          setStopAllModalOpen(false);
        }}
        onClose={() => setStopAllModalOpen(false)}
      />
    </div>
  );
}
