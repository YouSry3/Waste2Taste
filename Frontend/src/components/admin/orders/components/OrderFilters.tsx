import React from "react";
import { Card, CardContent } from "../../../ui/card";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { Search, Calendar, X, CheckCircle, Package } from "lucide-react";
import { FilterOptions } from "../types/orders.types";

interface OrderFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  selectedOrdersCount: number;
  onBulkAction: (action: "complete" | "cancel" | "print" | "ready") => void;
  onClearSelection: () => void;
}

export const OrderFiltersComponent: React.FC<OrderFiltersProps> = ({
  filters,
  onFilterChange,
  selectedOrdersCount,
  onBulkAction,
  onClearSelection,
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        {/* Bulk Actions */}
        {selectedOrdersCount > 0 && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg mb-4">
            <span className="text-sm font-medium">
              {selectedOrdersCount} order
              {selectedOrdersCount !== 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-2 ml-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBulkAction("complete")}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Mark Complete
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBulkAction("ready")}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Package className="h-4 w-4 mr-1" />
                Mark Ready
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBulkAction("cancel")}
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel Orders
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClearSelection}
                className="hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders by ID, customer, or vendor..."
              value={filters.searchTerm}
              onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
              className="pl-10 h-10"
            />
            {filters.searchTerm && (
              <button
                onClick={() => onFilterChange({ searchTerm: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-gray-100 p-1 rounded"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <Select
            value={filters.filterStatus}
            onValueChange={(value) => onFilterChange({ filterStatus: value })}
          >
            <SelectTrigger className="w-full md:w-48 h-10">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-dark border-border rounded-md shadow-lg z-50">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Ready for Pickup">Ready for Pickup</SelectItem>
              <SelectItem value="Pending Pickup">Pending Pickup</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Price Range */}
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min Price"
              value={filters.minAmount}
              onChange={(e) => onFilterChange({ minAmount: e.target.value })}
              className="w-28 h-10"
              min="0"
              step="0.01"
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={filters.maxAmount}
              onChange={(e) => onFilterChange({ maxAmount: e.target.value })}
              className="w-28 h-10"
              min="0"
              step="0.01"
            />
          </div>

          {/* Date Range */}
          <div className="flex gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                placeholder="Start Date"
                value={filters.startDate}
                onChange={(e) => onFilterChange({ startDate: e.target.value })}
                className="w-36 h-10 pl-10"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                placeholder="End Date"
                value={filters.endDate}
                onChange={(e) => onFilterChange({ endDate: e.target.value })}
                className="w-36 h-10 pl-10"
              />
            </div>
          </div>

          {/* Sort */}
          <Select
            value={filters.sortBy}
            onValueChange={(value) => onFilterChange({ sortBy: value })}
          >
            <SelectTrigger className="w-full md:w-48 h-10">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border rounded-md shadow-lg z-50">
              <SelectItem value="dateDesc">Newest First</SelectItem>
              <SelectItem value="dateAsc">Oldest First</SelectItem>
              <SelectItem value="amountDesc">Highest Price</SelectItem>
              <SelectItem value="amountAsc">Lowest Price</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
