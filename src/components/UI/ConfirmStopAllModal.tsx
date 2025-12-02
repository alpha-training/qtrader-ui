import Modal from "./Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmStopAllModal({ isOpen, onClose, onConfirm }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-md font-semibold mb-3">Stop all processes?</h2>

      <p className="text-gray-300 mb-4">
        This will stop <strong>all running processes</strong>.
      </p>

      <div className="flex justify-end gap-3">
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
          Stop all
        </button>
      </div>
    </Modal>
  );
}
