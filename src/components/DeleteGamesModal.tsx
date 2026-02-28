interface DeleteGamesModalProps {
  isOpen: boolean;
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteGamesModal({
  isOpen,
  count,
  onConfirm,
  onCancel,
}: DeleteGamesModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-fpl-1100 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-2xl font-bold text-white">
          Delete Selected Games
        </h2>
        <p className="mb-6 text-white/90">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{count}</span>{" "}
          {count === 1 ? "game" : "games"}? This will remove their saved league
          data from this browser and cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-transparent border border-white px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

