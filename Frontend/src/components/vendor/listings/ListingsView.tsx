// src/components/vendor/listings/ListingsView.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import {
  Plus,
  MapPin,
  Clock,
  RefreshCw,
  AlertCircle,
  ImageIcon,
} from "lucide-react";
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

// Context & types - CHANGED: Use context instead of hook
import { useVendorListings } from "./context/ListingsContext";
import {
  statusColors,
  formFields,
  CATEGORIES,
} from "./constants/listings.data";
import { Listing } from "./types/listing.types";

export function MyListings() {
  const navigate = useNavigate();

  // CHANGED: Use context instead of useListings hook
  const {
    filteredListings, // Use filteredListings (not listings)
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    updateListing,
    deleteListing,
  } = useVendorListings();

  // Context doesn't have loading states, so set to false (add to context if needed)
  const isLoading = false;
  const isUpdating = false;
  const isDeleting = false;
  const error = null;

  // Use categories from constants
  const categories = CATEGORIES;

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

  // UPDATE - FIXED: Context uses (id, data) signature, not ({id, data})
  const handleEdit = () => {
    if (!currentListing) return;

    updateListing(currentListing.id, formState); // Changed from object to separate args

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

  // Navigate to create listing page
  const handleCreateListing = () => {
    navigate("/panel/vendor/create-listing");
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
        <p className="text-red-600">{"Failed to load listings"}</p>
      </div>
    );
  }

  return (
    <div className="p-8 mt-6">
      <Toaster position="top-center" />
      {/* Header */}
      <div className="flex justify-between items-center mb-8 ">
        <div>
          <h1 className="text-2xl font-semibold">Food Listings</h1>
          <p className="text-gray-500">
            Manage surplus food listings • {filteredListings.length} active{" "}
            {/* CHANGED */}
          </p>
        </div>

        <Button
          onClick={handleCreateListing}
          className="bg-green-600 hover:bg-green-700 text-white"
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
      {filteredListings.length ===
      0 /* CHANGED from listings to filteredListings */ ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg mb-2">No listings found</p>
          <p className="text-gray-400 text-sm mb-6">
            {searchTerm || filterCategory !== "all" || filterStatus !== "all"
              ? "Try adjusting your filters"
              : "Create your first listing to get started"}
          </p>
          {!searchTerm &&
            filterCategory === "all" &&
            filterStatus === "all" && (
              <Button
                onClick={handleCreateListing}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Listing
              </Button>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(
            (listing /* CHANGED from listings to filteredListings */) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onEdit={openEditDialog}
                onView={openViewDialog}
                onDelete={handleDeleteListing}
                isLoading={isDeleting}
              />
            ),
          )}
        </div>
      )}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Listing Details</DialogTitle>
          </DialogHeader>

          {/* Photo Gallery */}
          {formState.photos && formState.photos.length > 0 ? (
            <div className="space-y-4">
              <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={formState.photos[0]}
                  alt={formState.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {formState.photos.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {formState.photos.slice(1).map((photo, index) => (
                    <div
                      key={index}
                      className="h-20 bg-gray-100 rounded overflow-hidden"
                    >
                      <img
                        src={photo}
                        alt={`${formState.title} ${index + 2}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400">
              <ImageIcon className="h-16 w-16 mb-3" />
              <p className="text-sm">No photos available</p>
            </div>
          )}

          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant={statusColors[formState.status || "Active"]}>
                    {formState.status}
                  </Badge>
                  <h3 className="font-semibold text-xl mt-2">
                    {formState.title}
                  </h3>
                  <p className="text-gray-600">{formState.vendor}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="text-lg font-semibold flex items-center">
                    ★ {formState.rating?.toFixed(1) || "4.5"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p>{formState.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-500">Pickup Time</p>
                    <p>{formState.pickupTime}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="text-gray-700 whitespace-pre-line">
                  {formState.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Original Price</p>
                  <p className="text-lg line-through text-gray-500">
                    ${formState.originalPrice?.toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Sale Price</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${formState.salePrice?.toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Available</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formState.quantity} bags
                  </p>
                </div>
              </div>

              {/* Calculate discount */}
              {formState.originalPrice && formState.salePrice && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="font-semibold text-green-800">
                    {Math.round(
                      (1 - formState.salePrice / formState.originalPrice) * 100,
                    )}
                    % OFF
                  </p>
                  <p className="text-sm text-green-700">
                    Save $
                    {(formState.originalPrice - formState.salePrice).toFixed(2)}{" "}
                    per bag
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button
                className="flex-1 bg-orange-400 hover:bg-orange-500 text-white"
                  onClick={() =>
                    currentListing && openEditDialog(currentListing)
                  }
                 
                >
                  Edit Listing
                </Button>
                <Button
                  onClick={() =>
                    currentListing && handleDeleteListing(currentListing.id)
                  }
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Listing"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
