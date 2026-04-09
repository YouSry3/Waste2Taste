import React from "react";
import { VendorRequest } from "../../types";
import { VendorCard } from "./VendorCard";
import { VendorBulkActions } from "./VendorBulkActions";
import { Card, CardContent } from "../../../../ui/card";
import { Store } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import { Filter } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VendorDocument } from "../../../../../types/vendorApproval";

interface VendorModerationProps {
  vendors: VendorRequest[];
  filteredVendors: VendorRequest[];
  paginatedVendors: VendorRequest[];
  selectedVendors: number[];
  loadingStates: { [key: string]: boolean };
  statusFilter: string;
  totalVendorsPages: number;
  vendorsPage: number;
  onSelectVendor: (id: number, checked: boolean) => void;
  onApproveVendor: (id: number) => void;
  onRejectVendor: (id: number) => void;
  onBulkApproveVendors: (selectedVendors: number[]) => Promise<number[]>;
  onBulkRejectVendors: (selectedVendors: number[]) => Promise<number[]>;
  onClearSelection: () => void;
  onStatusFilterChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onViewDocuments: (documents: VendorDocument[]) => void;
  onContactApplicant: (vendor: VendorRequest) => void;
}

export function VendorModeration({
  vendors,
  filteredVendors,
  paginatedVendors,
  selectedVendors,
  loadingStates,
  statusFilter,
  totalVendorsPages,
  vendorsPage,
  onSelectVendor,
  onApproveVendor,
  onRejectVendor,
  onBulkApproveVendors,
  onBulkRejectVendors,
  onClearSelection,
  onStatusFilterChange,
  onPageChange,
  onViewDocuments,
  onContactApplicant,
}: VendorModerationProps) {
  return (
    <div className="space-y-4">
      {/* Status Filter */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-gray-500" />
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border rounded-md shadow-lg z-50">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions Bar for Vendors */}
      {selectedVendors.length > 0 && (
        <VendorBulkActions
          selectedCount={selectedVendors.length}
          loading={loadingStates["bulk-approve-vendors"]}
          onApproveAll={() => onBulkApproveVendors(selectedVendors)}
          onRejectAll={() => onBulkRejectVendors(selectedVendors)}
          onClearSelection={onClearSelection}
        />
      )}

      {paginatedVendors.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Store className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No vendor requests found</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {paginatedVendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              isSelected={selectedVendors.includes(vendor.id)}
              isLoading={loadingStates[`vendor-${vendor.id}`]}
              onSelect={onSelectVendor}
              onApprove={onApproveVendor}
              onReject={onRejectVendor}
              onViewDocuments={onViewDocuments}
              onContactApplicant={onContactApplicant}
            />
          ))}

          {/* Pagination */}
          {totalVendorsPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => onPageChange(Math.max(1, vendorsPage - 1))}
                disabled={vendorsPage === 1}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="text-sm text-gray-600 px-4">
                Page {vendorsPage} of {totalVendorsPages}
              </span>
              <button
                onClick={() => onPageChange(vendorsPage + 1)}
                disabled={vendorsPage >= totalVendorsPages}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
