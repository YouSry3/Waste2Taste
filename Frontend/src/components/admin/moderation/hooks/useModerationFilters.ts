import { useState } from "react";
import { Listing, VendorRequest, CustomerReport } from "../types";

export function useModerationFilters() {
  // Filter & Search State - Tab specific
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination State
  const [listingsPage, setListingsPage] = useState(1);
  const [vendorsPage, setVendorsPage] = useState(1);
  const [reportsPage, setReportsPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Filtering & Sorting Logic
  const getFilteredListings = (listings: Listing[]) => {
    let filtered = listings;

    if (statusFilter !== "all") {
      filtered = filtered.filter((l) => l.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.vendor.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (l) => l.category.toLowerCase() === categoryFilter,
      );
    }

    if (sortBy === "date") {
      filtered.sort(
        (a, b) =>
          new Date(b.submitted).getTime() - new Date(a.submitted).getTime(),
      );
    } else if (sortBy === "flagged") {
      filtered.sort((a, b) => (b.flagged ? 1 : 0) - (a.flagged ? 1 : 0));
    }

    filtered.sort((a, b) => {
      if (a.flagged && !b.flagged) return -1;
      if (!a.flagged && b.flagged) return 1;
      return 0;
    });

    return filtered;
  };

  const getFilteredReports = (customerReports: CustomerReport[]) => {
    let filtered = customerReports;

    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.reporter.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((r) => r.priority === priorityFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((r) =>
        statusFilter === "under_review"
          ? r.status === "under_review"
          : statusFilter === "resolved"
            ? r.status === "resolved"
            : r.status === "dismissed",
      );
    }

    return filtered;
  };

  const getFilteredVendors = (vendorRequests: VendorRequest[]) => {
    let filtered = vendorRequests;

    if (statusFilter !== "all") {
      filtered = filtered.filter((v) => v.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (v) =>
          v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.ownerName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (v) => v.category.toLowerCase() === categoryFilter,
      );
    }

    return filtered;
  };

  // Pagination
  const getPaginatedItems = <T>(items: T[], page: number) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return items.slice(start, end);
  };

  // Get search placeholder based on active tab
  const getSearchPlaceholder = (activeTab: string) => {
    switch (activeTab) {
      case "listings":
        return "Search by title, vendor...";
      case "vendors":
        return "Search by business name, owner...";
      case "reports":
        return "Search by order ID, vendor, reporter...";
      case "activity":
        return "Search activity log...";
      default:
        return "Search...";
    }
  };

  return {
    // State
    searchQuery,
    categoryFilter,
    sortBy,
    priorityFilter,
    statusFilter,
    listingsPage,
    vendorsPage,
    reportsPage,

    // Setters
    setSearchQuery,
    setCategoryFilter,
    setSortBy,
    setPriorityFilter,
    setStatusFilter,
    setListingsPage,
    setVendorsPage,
    setReportsPage,

    // Functions
    getFilteredListings,
    getFilteredReports,
    getFilteredVendors,
    getPaginatedItems,
    getSearchPlaceholder,
    ITEMS_PER_PAGE,
  };
}
