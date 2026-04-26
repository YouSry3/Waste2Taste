import React from "react";
import {
  Listing,
  VendorRequest,
  CustomerReport,
  ModerationSummary,
} from "../types";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  summary?: ModerationSummary | null;
  listings: Listing[];
  vendorRequests: VendorRequest[];
  customerReports: CustomerReport[];
}

export function TabNavigation({
  activeTab,
  setActiveTab,
  summary,
  listings,
  vendorRequests,
  customerReports,
}: TabNavigationProps) {
  const pendingListingsCount = summary?.listingsToReviewCount ?? 0;
  const pendingVendorsCount = summary?.pendingVendorRequestsCount ?? 0;
  const openReportsCount = summary?.openCustomerReportsCount ?? 0;

  return (
    <div className="flex space-x-2 mb-6">
      <button
        onClick={() => setActiveTab("listings")}
        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center ${
          activeTab === "listings"
            ? "bg-orange-500 text-white shadow-md"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        Listing Moderation
        {pendingListingsCount > 0 && (
          <span
            className={`ml-2 px-2 py-1 text-xs rounded-full ${activeTab === "listings" ? "bg-orange-600" : "bg-orange-100 text-orange-800"}`}
          >
            {pendingListingsCount}
          </span>
        )}
      </button>

      <button
        onClick={() => setActiveTab("vendors")}
        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center ${
          activeTab === "vendors"
            ? "bg-orange-500 text-white shadow-md"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        Vendor Requests
        {pendingVendorsCount > 0 && (
          <span
            className={`ml-2 px-2 py-1 text-xs rounded-full ${activeTab === "vendors" ? "bg-orange-600" : "bg-orange-100 text-orange-800"}`}
          >
            {pendingVendorsCount}
          </span>
        )}
      </button>

      <button
        onClick={() => setActiveTab("reports")}
        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center ${
          activeTab === "reports"
            ? "bg-orange-500 text-white shadow-md"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        Customer Reports
        {openReportsCount > 0 && (
          <span
            className={`ml-2 px-2 py-1 text-xs rounded-full ${activeTab === "reports" ? "bg-orange-600" : "bg-orange-100 text-orange-800"}`}
          >
            {openReportsCount}
          </span>
        )}
      </button>

      <button
        onClick={() => setActiveTab("activity")}
        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center ${
          activeTab === "activity"
            ? "bg-orange-500 text-white shadow-md"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        Activity Log
      </button>
    </div>
  );
}
