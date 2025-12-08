import Modal from "./Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmStartAllModal({ isOpen, onClose, onConfirm }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-md mb-3 font-semibold">Start all processes?</h2>

      <p className="text-gray-300 mb-4">
        This will start <strong>all stopped processes</strong>.
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
          className="px-2 py-0.5 text-sm rounded-sm transition border border-green-600 text-green-400 hover:bg-green-600 hover:text-black"
        >
          Start all
        </button>
      </div>
    </Modal>
  );
}
