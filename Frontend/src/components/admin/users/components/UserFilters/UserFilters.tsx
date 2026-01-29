import { Card, CardContent } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { Search, X } from "lucide-react";
import { SortField, SortOrder } from "../../types";

interface UserFiltersProps {
  searchTerm: string;
  filterStatus: string;
  sortBy: SortField;
  sortOrder: SortOrder;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onSortChange: (field: SortField) => void;
}

export function UserFilters({
  searchTerm,
  filterStatus,
  sortBy,
  sortOrder,
  onSearchChange,
  onFilterChange,
  onSortChange,
}: UserFiltersProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 focus:border-0"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("all")}
              className={
                filterStatus === "all"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : ""
              }
            >
              All
            </Button>
            <Button
              variant={filterStatus === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("active")}
              className={
                filterStatus === "active"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : ""
              }
            >
              Active
            </Button>
            <Button
              variant={filterStatus === "inactive" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("inactive")}
              className={
                filterStatus === "inactive"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : ""
              }
            >
              Inactive
            </Button>
          </div>
        </div>

        {/* Sort Tabs Navigation */}
        <div className="mt-4 border-b border-gray-200">
          <div className="flex space-x-1 justify-self-end">
            <button
              onClick={() => onSortChange("name")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                sortBy === "name"
                  ? "bg-green-600 text-white border-b-2 border-green-600"
                  : "text-gray-600 hover:text-green-600 hover:bg-green-50"
              }`}
            >
              Sort by Name{" "}
              {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              onClick={() => onSortChange("orders")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                sortBy === "orders"
                  ? "bg-green-600 text-white border-b-2 border-green-600"
                  : "text-gray-600 hover:text-green-600 hover:bg-green-50"
              }`}
            >
              Sort by Orders{" "}
              {sortBy === "orders" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              onClick={() => onSortChange("totalSpent")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                sortBy === "totalSpent"
                  ? "bg-green-600 text-white border-b-2 border-green-600"
                  : "text-gray-600 hover:text-green-600 hover:bg-green-50"
              }`}
            >
              Sort by Spend{" "}
              {sortBy === "totalSpent" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              onClick={() => onSortChange("lastOrder")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                sortBy === "lastOrder"
                  ? "bg-green-600 text-white border-b-2 border-green-600"
                  : "text-gray-600 hover:text-green-600 hover:bg-green-50"
              }`}
            >
              Sort by Last Order{" "}
              {sortBy === "lastOrder" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
