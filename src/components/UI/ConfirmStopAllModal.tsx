import Modal from "./Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmStopAllModal({ isOpen, onClose, onConfirm }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4">Stop all processes?</h2>

      <p className="text-gray-300 mb-6">
        This will stop <strong>all running processes</strong>.
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
          className="px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-700"
        >
          Stop all
        </button>
      </div>
    </Modal>
  );
}
