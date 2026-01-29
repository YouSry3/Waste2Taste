// src/components/admin/listings/ListingsView.tsx
import { useState } from "react";
import { Button } from "../../ui/button";
import { Plus, MapPin, Clock, RefreshCw, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Components
import { ListingCard } from "./components/ListingCard";
import { ListingFilters } from "./components/ListingFilters";
import { ListingForm } from "./components/ListingForm";

// Dialogs
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";

// Hooks & API
import { useListings } from "./hooks/useListings";
import { statusColors, formFields } from "./constants/listings.data";
import { Listing } from "./types/listing.types";

// TODO: Remove mock data imports when backend is ready
import { initialListings } from "./constants/listings.data";

export function ListingsView() {
  // Use the custom hook for all listing logic
  const {
    // State
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,

    // Data
    listings,
    categories,
    stats,

    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,

    // Error states
    error,

    // Mutations
    createListing: createListingMutation,
    updateListing: updateListingMutation,
    deleteListing: deleteListingMutation,

    // Utilities
  } = useListings({
    initialFilters: {
      searchTerm: "",
      category: "all",
      status: "all",
    },
    page: 1,
    limit: 20,
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [currentListing, setCurrentListing] = useState<Listing | null>(null);

  const [formState, setFormState] = useState<Partial<Listing>>({
    vendor: "",
    title: "",
    category: "Bakery",
    originalPrice: 0,
    salePrice: 0,
    quantity: 0,
    pickupTime: "",
    location: "",
    description: "",
    status: "Active",
    rating: 0,
  });

  // Handle CREATE
  const handleCreate = () => {
    createListingMutation(formState, {
      onSuccess: () => {
        toast.success("Listing created successfully!");
        setCreateDialogOpen(false);
        // TODO: Clear form or reset state
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to create listing");
      },
    });
  };

  // Handle EDIT
  const handleEdit = () => {
    if (!currentListing) return;

    updateListingMutation(
      {
        id: currentListing.id,
        data: formState,
      },
      {
        onSuccess: () => {
          toast.success("Listing updated successfully!");
          setEditDialogOpen(false);
          setViewDialogOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to update listing");
        },
      },
    );
  };

  // Handle DELETE
  const handleDeleteListing = (id: number | string) => {
    deleteListingMutation(id, {
      onSuccess: () => {
        toast.success("Listing deleted successfully!");
        setViewDialogOpen(false);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to delete listing");
      },
    });
  };

  // Open EDIT dialog
  const openEditDialog = (listing: Listing) => {
    setFormState(listing);
    setCurrentListing(listing);
    setEditDialogOpen(true);
  };

  // Open VIEW dialog
  const openViewDialog = (listing: Listing) => {
    setFormState(listing);
    setCurrentListing(listing);
    setViewDialogOpen(true);
  };

  // Open CREATE dialog
  const openCreateDialog = () => {
    setFormState({
      vendor: "",
      title: "",
      category: "Bakery",
      originalPrice: 0,
      salePrice: 0,
      quantity: 0,
      pickupTime: "",
      location: "",
      description: "",
      status: "Active",
      rating: 0,
    });
    setCurrentListing(null);
    setCreateDialogOpen(true);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading listings...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Failed to load listings
          </h3>
          <p className="text-red-600 mb-4">
            {error.message || "An error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Toaster position="top-center" />

      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Food Listings
          </h1>
          <p className="text-gray-500">
            Manage surplus food listings from vendors
            {stats && (
              <span className="ml-2 text-green-600 font-medium">
                • {listings.length} active listings
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            onClick={openCreateDialog}
            disabled={isCreating}
          >
            {isCreating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {isCreating ? "Creating..." : "Create Listing"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ListingFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCategory={filterCategory}
        onCategoryChange={setFilterCategory}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        categories={categories}
        isLoading={isLoading}
      />

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No listings found</p>
          <Button
            onClick={openCreateDialog}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white"
          >
            Create your first listing
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onEdit={openEditDialog}
              onView={openViewDialog}
              onDelete={handleDeleteListing}
              isLoading={isDeleting}
            />
          ))}
        </div>
      )}

      {/* CREATE DIALOG */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Listing</DialogTitle>
          </DialogHeader>
          <ListingForm
            formState={formState}
            setFormState={setFormState}
            formFields={formFields}
            onSubmit={handleCreate}
            submitLabel={isCreating ? "Creating..." : "Add Listing"}
            isLoading={isCreating}
          />
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Listing</DialogTitle>
          </DialogHeader>
          <ListingForm
            formState={formState}
            setFormState={setFormState}
            formFields={formFields}
            onSubmit={handleEdit}
            submitLabel={isUpdating ? "Updating..." : "Update Listing"}
            isLoading={isUpdating}
          />
        </DialogContent>
      </Dialog>

      {/* VIEW DIALOG */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Listing Details</DialogTitle>
          </DialogHeader>
          <Card className="mt-2">
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-start justify-between mb-2">
                <Badge variant={statusColors[formState.status || "Active"]}>
                  {formState.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  ★ {formState.rating}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900">
                {formState.title}
              </h4>
              <p className="text-sm text-gray-600">{formState.vendor}</p>
              <hr className="border-gray-200 my-1" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" /> {formState.location}
              </div>
              <hr className="border-gray-200 my-1" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" /> Pickup: {formState.pickupTime}
              </div>
              <hr className="border-gray-200 my-1" />
              <p className="text-sm text-gray-500 line-through">
                ${formState.originalPrice?.toFixed(2)}
              </p>
              <p className="text-green-600 font-semibold">
                ${formState.salePrice?.toFixed(2)}
              </p>
              <hr className="border-gray-200 my-1" />
              <p className="text-sm">Quantity: {formState.quantity}</p>
              <hr className="border-gray-200 my-1" />
              <p className="text-sm text-gray-700">{formState.description}</p>

              {/* Edit & Delete inside view */}
              <div className="flex gap-2 mt-4">
                <Button
                  className="flex-1 bg-orange-400 hover:bg-orange-500 text-white"
                  onClick={() =>
                    currentListing && openEditDialog(currentListing)
                  }
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Edit"}
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() =>
                    currentListing && handleDeleteListing(currentListing.id)
                  }
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
