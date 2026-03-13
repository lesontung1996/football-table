import { Trash } from "lucide-react";

interface ClearResultHistoryModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ClearResultHistoryModal({
  onConfirm,
  onCancel,
}: ClearResultHistoryModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-fpl-1100 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-h2 text-white">Clear previous spins?</h2>
        <p className="mb-6 text-white/90">
          This will remove all saved spin results. You can&apos;t undo this.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-transparent border border-white px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Keep history
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            <Trash size={16} /> Clear history
          </button>
        </div>
      </div>
    </div>
  );
}
