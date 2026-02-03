// FilterTabs.tsx
import { X } from "lucide-react";
import { Button } from "../../../../ui/button";

interface FilterTab {
  id: string;
  label: string;
  isActive: boolean;
  colorClass: string;
  clearAction: () => void;
  value: string;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  onClearAll?: () => void;
}

export function FilterTabs({ tabs, onClearAll }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-500">Active filters:</span>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${tab.colorClass}`}
        >
          <span className="font-medium">{tab.label}:</span>
          <span>{tab.value}</span>
          <button
            onClick={tab.clearAction}
            className="ml-1 hover:opacity-70 transition-opacity"
            aria-label={`Clear ${tab.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}

      {onClearAll && tabs.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Clear All
        </Button>
      )}
    </div>
  );
}
