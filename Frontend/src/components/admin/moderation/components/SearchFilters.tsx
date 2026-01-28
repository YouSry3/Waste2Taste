import React from "react";
import { Card, CardContent } from "../../../ui/card";
import { Input } from "../../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { Search, Filter } from "lucide-react";

interface SearchFiltersProps {
  activeTab: string;
  searchQuery: string;
  categoryFilter: string;
  sortBy: string;
  priorityFilter: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onPriorityFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  getSearchPlaceholder: (tab: string) => string;
}

export function SearchFilters({
  activeTab,
  searchQuery,
  categoryFilter,
  sortBy,
  priorityFilter,
  statusFilter,
  onSearchChange,
  onCategoryFilterChange,
  onSortByChange,
  onPriorityFilterChange,
  onStatusFilterChange,
  getSearchPlaceholder,
}: SearchFiltersProps) {
  return (
    <Card className="mb-6 shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search-input"
              type="search"
              placeholder={
                getSearchPlaceholder(activeTab) + " (Press / to focus)"
              }
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Tab-specific filters */}
          {activeTab === "listings" && (
            <>
              <Select
                value={categoryFilter}
                onValueChange={onCategoryFilterChange}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border rounded-md shadow-lg z-50">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="bakery">Bakery</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="cafe">Cafe</SelectItem>
                  <SelectItem value="grocery">Grocery</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={onSortByChange}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border rounded-md shadow-lg z-50">
                  <SelectItem value="date">Newest First</SelectItem>
                  <SelectItem value="flagged">Flagged First</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}

          {activeTab === "vendors" && (
            <Select
              value={categoryFilter}
              onValueChange={onCategoryFilterChange}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Business Category" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border rounded-md shadow-lg z-50">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="bakery">Bakery</SelectItem>
                <SelectItem value="cafe">Cafe</SelectItem>
                <SelectItem value="grocery">Grocery</SelectItem>
                <SelectItem value="deli">Deli</SelectItem>
                <SelectItem value="market">Market</SelectItem>
              </SelectContent>
            </Select>
          )}

          {activeTab === "reports" && (
            <>
              <Select
                value={priorityFilter}
                onValueChange={onPriorityFilterChange}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border rounded-md shadow-lg z-50">
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Report Status" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border rounded-md shadow-lg z-50">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
