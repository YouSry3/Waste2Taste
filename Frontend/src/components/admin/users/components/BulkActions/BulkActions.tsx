import { useState, useRef, useEffect } from "react";
import { Button } from "../../../../../components/ui/button";
import { Check, X, ChevronDown } from "lucide-react";
import { BulkActionsDropdown } from "./BulkActionsDropdown";

interface BulkActionsProps {
  selectedCount: number;
  onClear: () => void;
  onBulkAction: (action: "activate" | "deactivate" | "delete") => Promise<void>;
}

export function BulkActions({
  selectedCount,
  onClear,
  onBulkAction,
}: BulkActionsProps) {
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const actionsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionsDropdownRef.current &&
        !actionsDropdownRef.current.contains(event.target as Node)
      ) {
        setShowActionsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleActionClick = async (
    action: "activate" | "deactivate" | "delete",
  ) => {
    setIsLoading(true);
    try {
      await onBulkAction(action);
    } finally {
      setIsLoading(false);
      setShowActionsDropdown(false);
    }
  };

  return (
    <div className="sticky top-4 z-50 mb-6">
      <div className="text-black rounded-lg shadow-xl p-4 border border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-2 rounded-lg border border-green-500/30">
              <Check className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-black font-semibold">
                {selectedCount} user{selectedCount !== 1 ? "s" : ""} selected
              </h3>
              <p className="text-black text-sm">
                Perform actions on selected users
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2" ref={actionsDropdownRef}>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              size="sm"
              onClick={onClear}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>

            <div className="relative">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                disabled={isLoading}
              >
                Actions
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>

              <BulkActionsDropdown
                show={showActionsDropdown}
                isLoading={isLoading}
                onActionClick={handleActionClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
