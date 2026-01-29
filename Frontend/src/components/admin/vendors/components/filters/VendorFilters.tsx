import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import { SearchBar } from "./SearchBar";
import { SortButtons } from "./SortButtons";
import { FilterTabs } from "./FilterTabs";

interface VendorFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  sortBy: "name" | "revenue" | "rating" | "listings";
  sortOrder: "asc" | "desc";
  toggleSort: (field: "name" | "revenue" | "rating" | "listings") => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  categories: string[];
}

export function VendorFilters({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  sortBy,
  sortOrder,
  toggleSort,
  resetFilters,
  hasActiveFilters,
  categories,
}: VendorFiltersProps) {
  const filterTabs = [
    {
      id: "search",
      label: "Search",
      isActive: searchTerm.trim() !== "",
      colorClass: "bg-blue-100 text-blue-700 border-blue-300",
      clearAction: () => setSearchTerm(""),
      value: searchTerm,
    },
    {
      id: "type",
      label: "Type",
      isActive: filterType !== "all",
      colorClass: "bg-purple-100 text-purple-700 border-purple-300",
      clearAction: () => setFilterType("all"),
      value: filterType,
    },
    {
      id: "category",
      label: "Category",
      isActive: filterCategory !== "all",
      colorClass: "bg-green-100 text-green-700 border-green-300",
      clearAction: () => setFilterCategory("all"),
      value: filterCategory,
    },
    {
      id: "status",
      label: "Status",
      isActive: filterStatus !== "all",
      colorClass: "bg-amber-100 text-amber-700 border-amber-300",
      clearAction: () => setFilterStatus("all"),
      value: filterStatus,
    },
  ];

  return (
    <div className="mb-6 space-y-4">
      <div className="flex gap-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border rounded-md shadow-lg z-50">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Vendor">Vendors</SelectItem>
            <SelectItem value="NGO Partner">NGO Partners</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4 items-center">
        <Filter className="h-4 w-4 text-gray-500" />

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border rounded-md shadow-lg z-50">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border rounded-md shadow-lg z-50">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <SortButtons sortBy={sortBy} toggleSort={toggleSort} />
      </div>

      {hasActiveFilters && (
        <FilterTabs tabs={filterTabs} onClearAll={resetFilters} />
      )}
    </div>
  );
}
