import { Button } from "../../../../ui/button";
import { X } from "lucide-react";

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
  onClearAll: () => void;
}

export function FilterTabs({ tabs, onClearAll }: FilterTabsProps) {
  const activeTabs = tabs.filter((tab) => tab.isActive);
  const activeCount = activeTabs.length;

  if (activeCount === 0) return null;

  return (
    <div className="pt-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-gray-700">
          Active Filters ({activeCount}):
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
        {activeTabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full border ${tab.colorClass}`}
          >
            <span className="text-xs font-medium">
              {tab.label}: {tab.value}
            </span>
            <button onClick={tab.clearAction} className="ml-1 hover:opacity-70">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
