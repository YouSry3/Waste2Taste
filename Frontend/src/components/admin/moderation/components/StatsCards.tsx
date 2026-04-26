import React from "react";
import { Card, CardContent } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Store, AlertTriangle, Package } from "lucide-react";
import {
  Listing,
  VendorRequest,
  CustomerReport,
  ModerationSummary,
} from "../types";

interface StatsCardsProps {
  summary?: ModerationSummary | null;
  listings: Listing[];
  vendorRequests: VendorRequest[];
  customerReports: CustomerReport[];
}

export function StatsCards({
  summary,
  listings,
  vendorRequests,
  customerReports,
}: StatsCardsProps) {
  const listingsToReviewCount = summary?.listingsToReviewCount ?? 0;
  const pendingVendorRequestsCount = summary?.pendingVendorRequestsCount ?? 0;
  const openCustomerReportsCount = summary?.openCustomerReportsCount ?? 0;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
      <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">
              Listings to Review
            </p>
            <Package className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-bold text-gray-900">
              {listingsToReviewCount}
            </h3>
            {listings.filter((l) => l.flagged && l.status === "pending")
              .length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {
                  listings.filter((l) => l.flagged && l.status === "pending")
                    .length
                }{" "}
                flagged
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Pending moderation</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">
              Pending Vendor Requests
            </p>
            <Store className="h-5 w-5 text-orange-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            {pendingVendorRequestsCount}
          </h3>
          <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">
              Open Customer Reports
            </p>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            {openCustomerReportsCount}
          </h3>
          <p className="text-xs text-gray-500 mt-1">Requires attention</p>
        </CardContent>
      </Card>
    </div>
  );
}
