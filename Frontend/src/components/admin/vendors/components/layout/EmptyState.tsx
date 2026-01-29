import { Store } from "lucide-react";
import { Card } from "../../../../ui/card";
import { Button } from "../../../../ui/button";

interface EmptyStateProps {
  hasFilters: boolean;
  resetFilters: () => void;
}

export function EmptyState({ hasFilters, resetFilters }: EmptyStateProps) {
  return (
    <Card className="p-12">
      <div className="text-center">
        <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No vendors found
        </h3>
        <p className="text-gray-500 mb-6">
          {hasFilters
            ? "Try adjusting your filters or search terms"
            : "Get started by adding your first vendor"}
        </p>
        {hasFilters && (
          <Button variant="outline" onClick={resetFilters}>
            Clear All Filters
          </Button>
        )}
      </div>
    </Card>
  );
}
