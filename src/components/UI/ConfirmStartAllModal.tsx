import Modal from "./Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmStartAllModal({ isOpen, onClose, onConfirm }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4">Start all processes?</h2>

      <p className="text-gray-300 mb-6">
        This will start <strong>all stopped processes</strong>.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700"
        >
          Start all
        </button>
      </div>
    </Modal>
  );
}
