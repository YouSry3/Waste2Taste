//all buttons functionlties are working now/style.... only missing the api intergaration with the back end, when the backend is done just add the api calls.
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Search, Plus, Clock, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import toast, { Toaster } from "react-hot-toast";

const initialListings = [
  {
    id: 1,
    vendor: "Green Valley Bakery",
    title: "Bakery Surprise Bag",
    category: "Bakery",
    originalPrice: "$15.00",
    salePrice: "$4.99",
    quantity: 5,
    pickupTime: "6:00 PM - 7:00 PM",
    status: "Active",
    location: "123 Valley Road",
    rating: 4.8,
  },
  {
    id: 2,
    vendor: "City Cafe",
    title: "Coffee & Pastries",
    category: "Cafe",
    originalPrice: "$18.00",
    salePrice: "$5.99",
    quantity: 3,
    pickupTime: "8:00 PM - 9:00 PM",
    status: "Active",
    location: "456 Main Street",
    rating: 4.6,
  },
];

export function ListingsView() {
  const [listings, setListings] = useState(initialListings);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentListing, setCurrentListing] = useState<any>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  const [formState, setFormState] = useState({
    vendor: "",
    title: "",
    category: "Bakery",
    originalPrice: "",
    salePrice: "",
    quantity: 0,
    pickupTime: "",
    location: "",
    description: "",
    status: "Active",
    rating: 0,
  });

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || listing.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || listing.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const openAddModal = () => {
    setFormState({
      vendor: "",
      title: "",
      category: "Bakery",
      originalPrice: "",
      salePrice: "",
      quantity: 0,
      pickupTime: "",
      location: "",
      description: "",
      status: "Active",
      rating: 0,
    });
    setCurrentListing(null);
    setIsViewOnly(false);
    setIsDialogOpen(true);
  };

  const openEditModal = (listing: any) => {
    setFormState(listing);
    setCurrentListing(listing);
    setIsViewOnly(false);
    setIsDialogOpen(true);
  };

  const openViewModal = (listing: any) => {
    setFormState(listing);
    setCurrentListing(listing);
    setIsViewOnly(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (currentListing) {
      setListings(
        listings.map((l) => (l.id === currentListing.id ? formState : l)),
      );
      toast.success("Listing updated successfully!");
    } else {
      const nextId = listings.length ? listings[listings.length - 1].id + 1 : 1;
      setListings([...listings, { ...formState, id: nextId }]);
      toast.success("Listing added successfully!");
    }
    setIsDialogOpen(false);
  };

  const handleDeleteListing = (id: number) => {
    setListings(listings.filter((l) => l.id !== id));
    toast.success("Listing deleted successfully!");
  };

  return (
    <div className="p-8">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold">Food Listings</h1>
          <p className="text-gray-500">
            Manage surplus food listings from vendors
          </p>
        </div>

        <Button
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 "
          onClick={openAddModal}
        >
          <Plus className="h-4 w-4" />
          Create Listing
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border rounded-md shadow-lg z-50">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Bakery">Bakery</SelectItem>
            <SelectItem value="Restaurant">Restaurant</SelectItem>
            <SelectItem value="Cafe">Cafe</SelectItem>
            <SelectItem value="Grocery">Grocery</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border rounded-md shadow-lg z-50">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Sold Out">Sold Out</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <Card key={listing.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <Badge
                  variant={
                    listing.status === "Active" ? "default" : "secondary"
                  }
                >
                  {listing.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  ★ {listing.rating}
                </span>
              </div>

              <h4 className="mb-2">{listing.title}</h4>
              <p className="text-sm text-gray-600 mb-4">{listing.vendor}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {listing.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  Pickup: {listing.pickupTime}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-500 line-through">
                    {listing.originalPrice}
                  </p>
                  <p className="text-green-600">{listing.salePrice}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Available</p>
                  <p>{listing.quantity} bags</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  size="sm"
                  onClick={() => openEditModal(listing)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  size="sm"
                  onClick={() => openViewModal(listing)}
                >
                  View
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  size="sm"
                  onClick={() => handleDeleteListing(listing.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit/View Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isViewOnly
                ? "View Listing"
                : currentListing
                  ? "Edit Listing"
                  : "Add Listing"}
            </DialogTitle>
          </DialogHeader>

          {isViewOnly ? (
            // ✅ View modal with dividers
            <Card className="mt-2">
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-start justify-between mb-2">
                  <Badge
                    variant={
                      formState.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {formState.status}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    ★ {formState.rating}
                  </span>
                </div>
                <h4 className="text-lg font-semibold">{formState.title}</h4>
                <p className="text-sm text-gray-600">{formState.vendor}</p>
                <hr className="border-gray-200 my-1" />
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {formState.location}
                </div>
                <hr className="border-gray-200 my-1" />
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  Pickup: {formState.pickupTime}
                </div>
                <hr className="border-gray-200 my-1" />
                <p className="text-sm text-gray-500 line-through">
                  {formState.originalPrice}
                </p>
                <p className="text-green-600">{formState.salePrice}</p>
                <hr className="border-gray-200 my-1" />
                <p className="text-sm">Quantity: {formState.quantity}</p>
                <hr className="border-gray-200 my-1" />
                <p className="text-sm">{formState.description}</p>
              </CardContent>
            </Card>
          ) : (
            // ✅ Add/Edit form
            <div className="flex flex-col gap-2 mt-2">
              {[
                { label: "Vendor", key: "vendor" },
                { label: "Title", key: "title" },
                { label: "Original Price", key: "originalPrice" },
                { label: "Sale Price", key: "salePrice" },
                { label: "Quantity", key: "quantity", type: "number" },
                { label: "Pickup Time", key: "pickupTime" },
                { label: "Location", key: "location" },
                { label: "Description", key: "description", isTextarea: true },
              ].map((field) => (
                <div key={field.key} className="mb-2">
                  <Label className="mb-1">{field.label}</Label>
                  {field.isTextarea ? (
                    <Textarea
                      value={formState[field.key]}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          [field.key]: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <Input
                      type={field.type || "text"}
                      value={formState[field.key]}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          [field.key]:
                            field.type === "number"
                              ? Number(e.target.value)
                              : e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              ))}

              <Button
                className="bg-green-600 hover:bg-green-700 mt-2 text-white"
                onClick={handleSubmit}
              >
                {currentListing ? "Update Listing" : "Add Listing"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
