// src/components/admin/listings/components/ListingFilters.tsx
import { Input } from "../../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { Search } from "lucide-react";

interface ListingFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterCategory: string;
  onCategoryChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
}

export function ListingFilters({
  searchTerm,
  onSearchChange,
  filterCategory,
  onCategoryChange,
  filterStatus,
  onStatusChange,
}: ListingFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search listings..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={filterCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="Bakery">Bakery</SelectItem>
          <SelectItem value="Restaurant">Restaurant</SelectItem>
          <SelectItem value="Cafe">Cafe</SelectItem>
          <SelectItem value="Grocery">Grocery</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Sold Out">Sold Out</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
