import { useState, useMemo, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { Vendor, VendorFormData } from "../api/vendors.types";
import { MOCK_VENDORS } from "../constants/vendors.data";
import {
  filterAndSortVendors,
  getTopPerformers,
  getVendorStats,
} from "../utils/vendors.helpers";
import { useVendorActions } from "./useVendorActions";
import { useVendorFilters } from "./useVendorFilters";
import { useVendorsList, useVendorsOverview } from "./useVendorsQueries";

export const useVendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filterState = useVendorFilters();
  const summaryQuery = useVendorsOverview();
  const listQuery = useVendorsList(1, 50);

  const actions = useVendorActions({
    vendors,
    setVendors,
    selectedVendor,
    vendorToDelete,
  });

  useEffect(() => {
    if (hasLocalChanges) return;

    const apiItems = listQuery.data?.items ?? [];
    if (listQuery.source === "api") {
      setVendors(apiItems);
    }
  }, [hasLocalChanges, listQuery.data?.items, listQuery.source]);

  const filteredVendors = useMemo(
    () =>
      filterAndSortVendors(vendors, {
        searchTerm: filterState.searchTerm,
        filterType: filterState.filterType,
        filterCategory: filterState.filterCategory,
        filterStatus: filterState.filterStatus,
        sortBy: filterState.sortBy,
        sortOrder: filterState.sortOrder,
      }),
    [vendors, filterState],
  );

  const stats = useMemo(() => {
    const apiSummary = summaryQuery.data;

    if (summaryQuery.source === "api") {
      return {
        totalVendors:
          apiSummary.totalVendors === null
            ? "No vendors listed"
            : apiSummary.totalVendors,
        ngoPartners:
          apiSummary.ngoPartners === null
            ? "No NGO partners"
            : apiSummary.ngoPartners,
        activeListings:
          apiSummary.activeListings === null
            ? "No active listings"
            : apiSummary.activeListings,
        totalRevenue:
          apiSummary.totalRevenue === null
            ? "No revenue data"
            : apiSummary.totalRevenue,
      };
    }

    return getVendorStats(vendors);
  }, [summaryQuery.data, vendors]);

  const topPerformers = useMemo(() => {
    if (summaryQuery.source === "api") {
      return summaryQuery.data.topPerformers;
    }
    return getTopPerformers(vendors);
  }, [summaryQuery.data.topPerformers, summaryQuery.source, vendors]);

  const categories = useMemo(
    () => Array.from(new Set(vendors.map((v) => v.category))),
    [vendors],
  );

  const handleAddVendor = useCallback(() => {
    setHasLocalChanges(true);
    const result = actions.addVendor(actions.formData);
    if (result.success) {
      setIsAddDialogOpen(false);
      actions.resetForm();
    }
    return result;
  }, [actions]);

  const handleEditVendor = useCallback(() => {
    setHasLocalChanges(true);
    if (!selectedVendor) {
      toast.error("No vendor selected");
      return { success: false };
    }

    const result = actions.editVendor(selectedVendor.id, actions.formData);
    if (result.success) {
      setIsEditDialogOpen(false);
      setIsDialogOpen(false);
      actions.resetForm();
    }
    return result;
  }, [actions, selectedVendor]);

  const handleDeleteVendor = useCallback(() => {
    setHasLocalChanges(true);
    if (!vendorToDelete) {
      toast.error("No vendor selected");
      return { success: false };
    }

    const result = actions.deleteVendor(vendorToDelete.id);
    if (result.success) {
      setIsDeleteDialogOpen(false);
      setIsDialogOpen(false);
      setVendorToDelete(null);
    }
    return result;
  }, [actions, vendorToDelete]);

  const handleToggleStatus = useCallback(
    (vendor: Vendor) => {
      setHasLocalChanges(true);
      return actions.toggleStatus(vendor);
    },
    [actions],
  );

  const handleExportCSV = useCallback(() => {
    return actions.exportVendors(vendors);
  }, [actions, vendors]);

  const resetFilters = useCallback(() => {
    filterState.setSearchTerm("");
    filterState.setFilterType("all");
    filterState.setFilterCategory("all");
    filterState.setFilterStatus("all");
  }, [filterState]);

  const hasActiveFilters = useMemo(
    () =>
      filterState.searchTerm !== "" ||
      filterState.filterType !== "all" ||
      filterState.filterCategory !== "all" ||
      filterState.filterStatus !== "all",
    [filterState],
  );

  const openEditDialog = useCallback(
    (vendor: Vendor) => {
      setSelectedVendor(vendor);
      actions.setFormData({
        name: vendor.name,
        type: vendor.type,
        category: vendor.category,
        contact: vendor.contact,
        email: vendor.email,
        phone: vendor.phone,
        address: vendor.address,
      });
      setIsDialogOpen(false);
      setIsEditDialogOpen(true);
    },
    [actions],
  );

  const openDeleteDialog = useCallback((vendor: Vendor) => {
    setVendorToDelete(vendor);
    setIsDialogOpen(false);
    setIsDeleteDialogOpen(true);
  }, []);

  return {
    // State
    vendors,
    filteredVendors,
    selectedVendor,
    vendorToDelete,

    // Filter State
    ...filterState,

    // Form State
    formData: actions.formData,
    formErrors: actions.formErrors,

    // Computed Values
    stats,
    topPerformers,
    categories,
    hasActiveFilters,
    isLoading: summaryQuery.isLoading || listQuery.isLoading,
    isError: summaryQuery.isError || listQuery.isError,
    dataSource:
      summaryQuery.source === "api" && listQuery.source === "api"
        ? "api"
        : summaryQuery.source === "demo" || listQuery.source === "demo"
          ? "demo"
          : "fallback",

    // Actions
    handleAddVendor,
    handleEditVendor,
    handleDeleteVendor,
    handleToggleStatus,
    handleExportCSV,
    resetFilters,
    openEditDialog,
    openDeleteDialog,

    // Form Actions
    handleInputChange: actions.handleInputChange,
    resetForm: actions.resetForm,

    // UI State
    isDialogOpen,
    setIsDialogOpen,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,

    // Setters
    setSelectedVendor,
    setVendorToDelete,
  };
};
