import { X } from "lucide-react";
import { Button } from "../../../../ui/button";

interface ActiveFilter {
  id: string;
  label: string;
  value: string;
  colorClass: string;
  onClear: () => void;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onClearAll: () => void;
}

export function ActiveFilters({ filters, onClearAll }: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="pt-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-gray-700">
          Active Filters ({filters.length}):
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-xs text-gray-500 hover:text-red-600"
        >
          Clear All
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <div
            key={filter.id}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full border ${filter.colorClass}`}
          >
            <span className="text-xs font-medium">
              {filter.label}: {filter.value}
            </span>
            <button onClick={filter.onClear} className="ml-1 hover:opacity-70">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
