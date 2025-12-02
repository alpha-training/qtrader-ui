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
      <h2 className="text-md mb-3">
        Are you sure you want to stop the process{" "}
        <span className="text-white font-bold">“{processName}”</span>?
      </h2>

      <div className="flex justify-end gap-3 mt-3">
        <button
          onClick={onClose}
          className="px-2 py-0.5 text-sm rounded-sm border border-gray-600
          text-gray-300 bg-gray-700
          hover:bg-gray-600 hover:text-white
          transition"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          className="px-2 py-0.5 text-sm rounded-sm border border-orange-600 text-orange-400
          hover:bg-orange-600 hover:text-black transition"
        >
          Stop
        </button>
      </div>
    </Modal>
  );
}
