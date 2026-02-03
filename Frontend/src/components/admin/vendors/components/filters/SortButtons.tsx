// SortButtons.tsx
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "../../../../ui/button";

interface SortButtonsProps {
  sortBy: "name" | "revenue" | "rating" | "listings";
  sortOrder: "asc" | "desc";
  toggleSort: (field: "name" | "revenue" | "rating" | "listings") => void;
}

export function SortButtons({
  sortBy,
  sortOrder,
  toggleSort,
}: SortButtonsProps) {
  const getSortIcon = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown className="ml-2 h-3 w-3" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-2 h-3 w-3" />
    );
  };

  return (
    <div className="flex gap-2 ml-auto">
      <Button
        variant="outline"
        size="sm"
        onClick={() => toggleSort("name")}
        className={sortBy === "name" ? "bg-green-50 border-green-600" : ""}
      >
        Name {getSortIcon("name")}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => toggleSort("revenue")}
        className={sortBy === "revenue" ? "bg-green-50 border-green-600" : ""}
      >
        Revenue {getSortIcon("revenue")}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => toggleSort("rating")}
        className={sortBy === "rating" ? "bg-green-50 border-green-600" : ""}
      >
        Rating {getSortIcon("rating")}
      </Button>
    </div>
  );
}
