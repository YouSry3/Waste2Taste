import { ArrowUpDown } from "lucide-react";
import { Button } from "../../../../ui/button";

interface SortButtonsProps {
  sortBy: "name" | "revenue" | "rating" | "listings";
  toggleSort: (field: "name" | "revenue" | "rating" | "listings") => void;
}

export function SortButtons({ sortBy, toggleSort }: SortButtonsProps) {
  return (
    <div className="flex gap-2 ml-auto">
      <Button
        variant="outline"
        size="sm"
        onClick={() => toggleSort("name")}
        className={sortBy === "name" ? "bg-green-50 border-green-600" : ""}
      >
        Name <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => toggleSort("revenue")}
        className={sortBy === "revenue" ? "bg-green-50 border-green-600" : ""}
      >
        Revenue <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => toggleSort("rating")}
        className={sortBy === "rating" ? "bg-green-50 border-green-600" : ""}
      >
        Rating <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    </div>
  );
}
