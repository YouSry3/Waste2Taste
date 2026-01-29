import { CheckCircle, Ban, Trash2 } from "lucide-react";

interface BulkActionsDropdownProps {
  show: boolean;
  isLoading: boolean;
  onActionClick: (action: "activate" | "deactivate" | "delete") => void;
}

export function BulkActionsDropdown({
  show,
  isLoading,
  onActionClick,
}: BulkActionsDropdownProps) {
  if (!show) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
      <div className="py-2">
        <button
          onClick={() => onActionClick("activate")}
          className="w-full px-4 py-3 text-sm text-left hover:bg-green-100 flex items-center gap-3 disabled:opacity-50 transition-colors border-b border-gray-200"
          disabled={isLoading}
        >
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-green-400" />
          </div>
          <div>
            <p className="font-medium text-green-600">Activate Selected</p>
            <p className="text-xs text-green-600">Set users to active status</p>
          </div>
        </button>

        <button
          onClick={() => onActionClick("deactivate")}
          className="w-full px-4 py-3 text-sm text-left hover:bg-gray-100 flex items-center gap-3 disabled:opacity-50 transition-colors border-b border-gray-200"
          disabled={isLoading}
        >
          <div className="w-8 h-8 rounded-lg bg-gray-700/50 flex items-center justify-center">
            <Ban className="h-4 w-4 text-gray-300" />
          </div>
          <div>
            <p className="font-medium text-gray-600">Deactivate Selected</p>
            <p className="text-xs text-gray-600">
              Set users to inactive status
            </p>
          </div>
        </button>

        <button
          onClick={() => onActionClick("delete")}
          className="w-full px-4 py-3 text-sm text-left hover:bg-red-900/20 flex items-center gap-3 disabled:opacity-50 transition-colors"
          disabled={isLoading}
        >
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
            <Trash2 className="h-4 w-4 text-red-400" />
          </div>
          <div>
            <p className="font-medium text-red-400">Delete Selected</p>
            <p className="text-xs text-red-400/70">Permanently remove users</p>
          </div>
        </button>
      </div>
    </div>
  );
}
