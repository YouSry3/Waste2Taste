import React from "react";
import { Listing, VendorRequest, CustomerReport } from "../types";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  listings: Listing[];
  vendorRequests: VendorRequest[];
  customerReports: CustomerReport[];
}

export function TabNavigation({
  activeTab,
  setActiveTab,
  listings,
  vendorRequests,
  customerReports,
}: TabNavigationProps) {
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
        {listings.filter((l) => l.status === "pending").length > 0 && (
          <span
            className={`ml-2 px-2 py-1 text-xs rounded-full ${activeTab === "listings" ? "bg-orange-600" : "bg-orange-100 text-orange-800"}`}
          >
            {listings.filter((l) => l.status === "pending").length}
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
        {vendorRequests.filter((v) => v.status === "pending").length > 0 && (
          <span
            className={`ml-2 px-2 py-1 text-xs rounded-full ${activeTab === "vendors" ? "bg-orange-600" : "bg-orange-100 text-orange-800"}`}
          >
            {vendorRequests.filter((v) => v.status === "pending").length}
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
        {customerReports.filter((r) => r.status === "under_review").length >
          0 && (
          <span
            className={`ml-2 px-2 py-1 text-xs rounded-full ${activeTab === "reports" ? "bg-orange-600" : "bg-orange-100 text-orange-800"}`}
          >
            {customerReports.filter((r) => r.status === "under_review").length}
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
