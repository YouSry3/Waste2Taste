import React from "react";
import { VendorRequest } from "../../types";
import { Card, CardContent } from "../../../../ui/card";
import { Badge } from "../../../../ui/badge";
import { Checkbox } from "../../../../ui/checkbox";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Eye,
  MessageCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { VendorDocument } from "../../../../../types/vendorApproval";

interface VendorCardProps {
  vendor: VendorRequest;
  isSelected: boolean;
  isLoading: boolean;
  onSelect: (id: number, checked: boolean) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onViewDocuments: (documents: VendorDocument[]) => void;
  onContactApplicant: (vendor: VendorRequest) => void;
}

export function VendorCard({
  vendor,
  isSelected,
  isLoading,
  onSelect,
  onApprove,
  onReject,
  onViewDocuments,
  onContactApplicant,
}: VendorCardProps) {
  const isPending = vendor.status === "pending";
  const statusBadgeClass =
    vendor.status === "approved"
      ? "bg-green-100 text-green-700"
      : vendor.status === "rejected"
        ? "bg-red-100 text-red-700"
        : "bg-amber-100 text-amber-700";

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(vendor.id, !!checked)}
            />
            <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl">
              <Store className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                {vendor.businessName}
              </h4>
              <p className="text-sm text-gray-600">Owner: {vendor.ownerName}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className="bg-orange-100 text-orange-700">
              {vendor.category}
            </Badge>
            <Badge className={statusBadgeClass}>
              {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Contact Information
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="h-4 w-4 text-orange-500" />
                {vendor.email}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="h-4 w-4 text-green-600" />
                {vendor.phone}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-4 w-4 text-red-500" />
                {vendor.address}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Submitted Documents
            </p>
            <div className="space-y-2">
              {vendor.documents.map((doc, idx) => (
                <div
                  key={doc.id || idx}
                  className="flex items-center gap-2 text-sm bg-green-50 p-2 rounded-lg"
                >
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">
                    {doc.label}: {doc.name}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              <Clock className="h-3 w-3 inline mr-1" />
              Submitted: {vendor.submitted}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {isPending && (
            <>
              <button
                onClick={() => onApprove(vendor.id)}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Approve Vendor
                  </>
                )}
              </button>

              <button
                onClick={() => onReject(vendor.id)}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <XCircle className="h-4 w-4" />
                Reject Application
              </button>
            </>
          )}

          <button
            onClick={() => onViewDocuments(vendor.documents)}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <Eye className="h-4 w-4" />
            View Documents
          </button>

          <button
            onClick={() => onContactApplicant(vendor)}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <MessageCircle className="h-4 w-4" />
            Contact Applicant
          </button>
        </div>
        {!isPending && vendor.notes && (
          <p className="mt-3 text-xs text-gray-500">{vendor.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}
