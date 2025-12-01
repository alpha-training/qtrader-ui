import Modal from "./Modal";

type Props = {
  isOpen: boolean;
  processName: string | null;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmStopModal({
  isOpen,
  processName,
  onConfirm,
  onClose,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4">
        Are you sure you want to stop the process{" "}
        <span className="text-white">“{processName}”</span>?
      </h2>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white"
        >
          Stop
        </button>
      </div>
    </Modal>
  );
}
