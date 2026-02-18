import React from "react";
import { Button } from "../../../ui/button";
import { Download, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { cn } from "../../../../lib/utils";

interface OrderActionsProps {
  onExportCSV: () => void;
  onExportPDF: () => void;
  totalOrders: number;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const OrderActions: React.FC<OrderActionsProps> = ({
  onExportCSV,
  onExportPDF,
  totalOrders,
  itemsPerPage,
  onItemsPerPageChange,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <>
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 my-7">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500">
            Manage customer orders and transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="flex items-center gap-2 hover:bg-green-50 !important border-green-600 border-1 text-green-600"
            onClick={onExportCSV}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            className="flex items-center gap-2 hover:bg-green-50 !important border-green-600 border-1 text-green-600"
            onClick={onExportPDF}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex gap-1 text-white">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    size="sm"
                    variant={pageNum === currentPage ? "default" : "outline"}
                    onClick={() => onPageChange(pageNum)}
                    className={cn(
                      pageNum === currentPage
                        ? "bg-green-600 hover:bg-green-700"
                        : "hover:bg-gray-100",
                    )}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPageChange(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="hover:bg-gray-100"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
