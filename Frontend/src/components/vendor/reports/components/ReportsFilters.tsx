import { Search } from "lucide-react";
import { Button } from "../../../ui/button";
import { Card, CardContent } from "../../../ui/card";
import { Input } from "../../../ui/input";
import { ReportStatus } from "../types";

interface ReportsFiltersProps {
  searchQuery: string;
  filterStatus: ReportStatus | "all";
  onSearchChange: (value: string) => void;
  onFilterChange: (value: ReportStatus | "all") => void;
}

export function ReportsFilters({
  searchQuery,
  filterStatus,
  onSearchChange,
  onFilterChange,
}: ReportsFiltersProps) {
  return (
    <Card className="shadow-sm border-gray-200 mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by report ID, customer, order, or listing..."
              className="pl-10"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
            />
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
              variant={filterStatus === "Pending Response" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("Pending Response")}
              className={
                filterStatus === "Pending Response"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : ""
              }
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === "Under Review" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("Under Review")}
              className={
                filterStatus === "Under Review"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : ""
              }
            >
              In Review
            </Button>
            <Button
              variant={filterStatus === "Resolved" ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("Resolved")}
              className={
                filterStatus === "Resolved"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : ""
              }
            >
              Resolved
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
