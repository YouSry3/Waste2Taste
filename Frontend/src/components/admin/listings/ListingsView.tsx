// src/components/admin/listings/ListingsView.tsx
import { useState } from "react";
import { Button } from "../../ui/button";
import { Plus, MapPin, Clock, RefreshCw, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Components
import { ListingCard } from "./components/ListingCard";
import { ListingFilters } from "./components/ListingFilters";
import { ListingForm } from "./components/ListingForm";

// UI
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";

// Hooks & types
import { useListings } from "./hooks/useListings";
import { statusColors, formFields } from "./constants/listings.data";
import { Listing } from "./types/listing.types";

export function ListingsView() {
  const {
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,

    listings,
    categories,
    stats,

    isLoading,
    isCreating,
    isUpdating,
    isDeleting,

    error,

    createListing,
    updateListing,
    deleteListing,
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

  // CREATE
  const handleCreate = () => {
    createListing(formState);
    toast.success("Listing created successfully!");
    setCreateDialogOpen(false);
  };

  // UPDATE
  const handleEdit = () => {
    if (!currentListing) return;

    updateListing({
      id: currentListing.id,
      data: formState,
    });

    toast.success("Listing updated successfully!");
    setEditDialogOpen(false);
    setViewDialogOpen(false);
  };

  // DELETE
  const handleDeleteListing = (id: number | string) => {
    deleteListing(id);
    toast.success("Listing deleted successfully!");
    setViewDialogOpen(false);
  };

  const openEditDialog = (listing: Listing) => {
    setCurrentListing(listing);
    setFormState(listing);
    setEditDialogOpen(true);
  };

  const openViewDialog = (listing: Listing) => {
    setCurrentListing(listing);
    setFormState(listing);
    setViewDialogOpen(true);
  };

  const openCreateDialog = () => {
    setCurrentListing(null);
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
    setCreateDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen">
        <RefreshCw className="h-10 w-10 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-4" />
        <p className="text-red-600">
          {error.message || "Failed to load listings"}
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Food Listings</h1>
          <p className="text-gray-500">
            Manage surplus food listings • {listings.length} active
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={isCreating}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Listing
        </Button>
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

      {/* Grid */}
      {listings.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No listings found</p>
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

      {/* CREATE */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Listing</DialogTitle>
          </DialogHeader>
          <ListingForm
            formState={formState}
            setFormState={setFormState}
            formFields={formFields}
            onSubmit={handleCreate}
            submitLabel="Add Listing"
            isLoading={isCreating}
          />
        </DialogContent>
      </Dialog>

      {/* EDIT */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Listing</DialogTitle>
          </DialogHeader>
          <ListingForm
            formState={formState}
            setFormState={setFormState}
            formFields={formFields}
            onSubmit={handleEdit}
            submitLabel="Update Listing"
            isLoading={isUpdating}
          />
        </DialogContent>
      </Dialog>

      {/* VIEW */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Listing Details</DialogTitle>
          </DialogHeader>
          <Card>
            <CardContent className="space-y-2">
              <Badge variant={statusColors[formState.status || "Active"]}>
                {formState.status}
              </Badge>
              <h3 className="font-semibold">{formState.title}</h3>
              <p>{formState.vendor}</p>
              <p className="text-sm flex gap-2">
                <MapPin className="h-4 w-4" /> {formState.location}
              </p>
              <p className="text-sm flex gap-2">
                <Clock className="h-4 w-4" /> {formState.pickupTime}
              </p>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() =>
                    currentListing && openEditDialog(currentListing)
                  }
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() =>
                    currentListing && handleDeleteListing(currentListing.id)
                  }
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
