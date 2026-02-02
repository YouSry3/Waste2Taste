import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Upload,
  Info,
  X,
  ArrowLeft,
  Check,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useVendorListings } from "../vendor/listings/context/ListingsContext";

// Interface for prefilled data
interface PrefilledListingData {
  name?: string;
  category?: string;
  stock?: number;
  expiry?: string;
  status?: string;
  price?: number;
}

interface CreateListingProps {
  prefilledData?: PrefilledListingData;
}

export function CreateListing({
  prefilledData: propPrefilledData,
}: CreateListingProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the createListing function from the context
  const { createListing } = useVendorListings();

  // Get prefilled data from location state or props
  const statePrefilledData = location.state?.prefilledData as
    | PrefilledListingData
    | undefined;
  const prefilledData = propPrefilledData || statePrefilledData;

  // Form state
  const [formData, setFormData] = useState({
    vendor: "",
    title: "",
    category: "",
    description: "",
    originalPrice: "",
    salePrice: "",
    quantity: "",
    pickupTime: "",
    location: "",
    charityEnabled: false,
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Auto-fill form based on prefilled data
  useEffect(() => {
    if (prefilledData) {
      const suggestions = getListingSuggestions(prefilledData);

      setFormData((prev) => ({
        ...prev,
        title: suggestions.title,
        category: suggestions.category,
        quantity: suggestions.quantity.toString(),
        description: suggestions.description,
        salePrice: suggestions.salePrice.toString(),
        originalPrice: suggestions.originalPrice.toString(),
        pickupTime: suggestions.pickupTime,
      }));
    }
  }, [prefilledData]);

  // Create preview URLs for uploaded images
  useEffect(() => {
    const previews = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    // Clean up preview URLs
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [images]);

  // Helper functions for suggestions
  const getListingSuggestions = (data: PrefilledListingData) => {
    const basePrice = data.price || 15.0;
    const stock = data.stock || 1;
    const pickupTime = getPickupTimeSuggestions(data.status);

    return {
      title: `${data.name || "Surprise Bag"} - ${getUrgencyLabel(data.status)}`,
      category: data.category || "bakery",
      quantity: stock,
      description: getDescriptionSuggestions(data),
      originalPrice: basePrice.toFixed(2),
      salePrice: (basePrice * 0.3).toFixed(2), // 70% off
      pickupTime: pickupTime,
    };
  };

  const getUrgencyLabel = (status?: string) => {
    switch (status) {
      case "critical":
        return "Last Chance!";
      case "low":
        return "Limited Time";
      case "medium":
        return "Fresh Today";
      default:
        return "Special Offer";
    }
  };

  const getDescriptionSuggestions = (data: PrefilledListingData) => {
    const urgencyLabels = {
      critical: "⚠️ URGENT: Must sell today! Expiring very soon.",
      low: "Last chance to enjoy these fresh items.",
      medium: "Fresh items available for pickup today.",
      good: "Great value on quality items.",
    };

    const urgencyMsg = data.status
      ? urgencyLabels[data.status as keyof typeof urgencyLabels]
      : "";

    return `${urgencyMsg}\n\nA selection of ${data.name || "fresh bakery items"} in perfect condition. All items are surplus but still delicious and ready to enjoy. Pick up today and help reduce food waste!`;
  };

  const getPickupTimeSuggestions = (status?: string) => {
    const now = new Date();

    switch (status) {
      case "critical":
        const criticalStart = new Date(now.getTime() + 30 * 60000);
        const criticalEnd = new Date(now.getTime() + 2 * 60 * 60000);
        return `${formatTime(criticalStart)} - ${formatTime(criticalEnd)}`;
      case "low":
        const lowStart = new Date(now.getTime() + 60 * 60000);
        const lowEnd = new Date(now.getTime() + 4 * 60 * 60000);
        return `${formatTime(lowStart)} - ${formatTime(lowEnd)}`;
      default:
        return "5:00 PM - 8:00 PM";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 3 - images.length);
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.vendor.trim()) errors.vendor = "Vendor name is required";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.pickupTime.trim())
      errors.pickupTime = "Pickup time is required";

    const originalPrice = parseFloat(formData.originalPrice);
    const salePrice = parseFloat(formData.salePrice);
    const quantity = parseInt(formData.quantity);

    if (!formData.originalPrice || originalPrice <= 0) {
      errors.originalPrice = "Original price must be greater than 0";
    }
    if (!formData.salePrice || salePrice <= 0) {
      errors.salePrice = "Sale price must be greater than 0";
    }
    if (salePrice >= originalPrice) {
      errors.salePrice = "Sale price must be less than original price";
    }
    if (!formData.quantity || quantity <= 0) {
      errors.quantity = "Quantity must be greater than 0";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert uploaded images to base64 strings for storage
      const photoPromises = images.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      const photos = await Promise.all(photoPromises);

      console.log("Creating listing with photos:", photos.length);

      // Create the listing using the context
      const newListing = createListing({
        vendor: formData.vendor,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        originalPrice: parseFloat(formData.originalPrice),
        salePrice: parseFloat(formData.salePrice),
        quantity: parseInt(formData.quantity),
        pickupTime: formData.pickupTime,
        location: formData.location,
        status: "Active",
        rating: 4.5,
        photos: photos, // Save the photos
      });

      console.log("New listing created:", newListing);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success("Listing created successfully!");

      // Navigate back to listings page
      setTimeout(() => {
        navigate("/panel/vendor/listings");
      }, 1000);
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to create listing");
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const discountPercentage =
    formData.originalPrice && formData.salePrice
      ? Math.round(
          (1 -
            parseFloat(formData.salePrice) /
              parseFloat(formData.originalPrice)) *
            100,
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Toaster position="top-center" />

      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/panel/vendor/listings")}
                className="h-9 w-9 p-0 hover:bg-gray-200"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">
                Create New Listing
              </h1>
            </div>
            <p className="text-gray-600 ml-12">
              {prefilledData
                ? `Quick listing for "${prefilledData.name}"`
                : "Add a new surplus food listing to reduce waste and help customers save"}
            </p>
          </div>

          {prefilledData && (
            <div
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide ${
                prefilledData.status === "critical"
                  ? "bg-red-100 text-red-800"
                  : prefilledData.status === "low"
                    ? "bg-orange-100 text-orange-800"
                    : prefilledData.status === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
              }`}
            >
              {prefilledData.status || "NEW"}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Unified Form Container */}
              <Card className="shadow-sm border-gray-200 overflow-hidden">
                <div className="space-y-0">
                  {/* Image Upload Section */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                          Listing Photos
                          <span className="text-xs font-normal text-gray-500">
                            (Optional but recommended)
                          </span>
                        </h3>
                      </div>

                      {images.length < 3 && (
                        <label className="group border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-green-500 hover:bg-green-50/50 transition-all cursor-pointer block">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3 group-hover:text-green-600 transition-colors" />
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Click to upload or drag & drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG up to 10MB • {3 - images.length} remaining
                          </p>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}

                      {/* Preview uploaded images */}
                      {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                          {imagePreviews.map((preview, index) => (
                            <div
                              key={index}
                              className="relative group aspect-square"
                            >
                              <img
                                src={preview}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              {index === 0 && (
                                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                                  Primary
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Basic Information Section */}
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">
                      Basic Information
                    </h3>
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-1">
                          Vendor/Store Name
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          placeholder="e.g., Green Valley Bakery"
                          className={`h-11 ${formErrors.vendor ? "border-red-500" : ""}`}
                          value={formData.vendor}
                          onChange={(e) =>
                            handleChange("vendor", e.target.value)
                          }
                        />
                        {formErrors.vendor && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {formErrors.vendor}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-1">
                          Listing Title
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          placeholder="e.g., Fresh Bakery Surprise Bag"
                          className={`h-11 ${formErrors.title ? "border-red-500" : ""}`}
                          value={formData.title}
                          onChange={(e) =>
                            handleChange("title", e.target.value)
                          }
                          maxLength={100}
                        />
                        <div className="flex justify-between items-center">
                          {formErrors.title ? (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {formErrors.title}
                            </p>
                          ) : (
                            <p className="text-xs text-gray-500">
                              Make it catchy and descriptive
                            </p>
                          )}
                          <p className="text-xs text-gray-400">
                            {formData.title.length}/100
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-1">
                          Category
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            handleChange("category", value)
                          }
                        >
                          <SelectTrigger
                            className={`h-11 ${formErrors.category ? "border-red-500" : ""}`}
                          >
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="Bakery">🥖 Bakery</SelectItem>
                            <SelectItem value="Restaurant">
                              🍱 Restaurant
                            </SelectItem>
                            <SelectItem value="Cafe">☕ Cafe</SelectItem>
                            <SelectItem value="Grocery">🛒 Grocery</SelectItem>
                            <SelectItem value="Other">📦 Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.category && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {formErrors.category}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-1">
                          Description
                          <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          rows={5}
                          placeholder="Describe what customers can expect in this surprise bag..."
                          className={`resize-none ${formErrors.description ? "border-red-500" : ""}`}
                          value={formData.description}
                          onChange={(e) =>
                            handleChange("description", e.target.value)
                          }
                          maxLength={500}
                        />
                        <div className="flex justify-between items-center">
                          {formErrors.description ? (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {formErrors.description}
                            </p>
                          ) : (
                            <p className="text-xs text-gray-500">
                              Be specific about items, freshness, and value
                            </p>
                          )}
                          <p className="text-xs text-gray-400">
                            {formData.description.length}/500
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Availability Section */}
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">
                      Pricing & Availability
                    </h3>
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-1">
                            Original Price
                            <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                              $
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              className={`pl-8 h-11 ${formErrors.originalPrice ? "border-red-500" : ""}`}
                              value={formData.originalPrice}
                              onChange={(e) =>
                                handleChange("originalPrice", e.target.value)
                              }
                            />
                          </div>
                          {formErrors.originalPrice && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {formErrors.originalPrice}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-1">
                            Sale Price
                            <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                              $
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              className={`pl-8 h-11 ${formErrors.salePrice ? "border-red-500" : ""}`}
                              value={formData.salePrice}
                              onChange={(e) =>
                                handleChange("salePrice", e.target.value)
                              }
                            />
                          </div>
                          {formErrors.salePrice ? (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {formErrors.salePrice}
                            </p>
                          ) : (
                            discountPercentage > 0 && (
                              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                <Check className="h-3 w-3" />
                                {discountPercentage}% off retail price
                              </p>
                            )
                          )}
                        </div>
                      </div>

                      {/* Savings Preview */}
                      {formData.originalPrice &&
                        formData.salePrice &&
                        discountPercentage > 0 && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-green-900">
                                  Customer Savings
                                </p>
                                <p className="text-xs text-green-700">
                                  They save $
                                  {(
                                    parseFloat(formData.originalPrice) -
                                    parseFloat(formData.salePrice)
                                  ).toFixed(2)}{" "}
                                  per bag
                                </p>
                              </div>
                              <div className="bg-green-600 text-white px-4 py-2 rounded-full font-bold text-lg">
                                {discountPercentage}% OFF
                              </div>
                            </div>
                          </div>
                        )}

                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-1">
                          Available Quantity
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          placeholder="How many bags available?"
                          className={`h-11 ${formErrors.quantity ? "border-red-500" : ""}`}
                          value={formData.quantity}
                          onChange={(e) =>
                            handleChange("quantity", e.target.value)
                          }
                        />
                        {formErrors.quantity ? (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {formErrors.quantity}
                          </p>
                        ) : prefilledData?.stock ? (
                          <p className="text-xs text-gray-500">
                            Based on available stock: {prefilledData.stock}{" "}
                            items
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500">
                            Number of surprise bags customers can purchase
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pickup Details Section */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Pickup Details
                    </h3>
                    {prefilledData?.status && (
                      <p className="text-sm text-gray-600 flex items-center gap-1 mb-4">
                        <Info className="h-4 w-4" />
                        Times suggested based on urgency:{" "}
                        <span className="font-medium">
                          {prefilledData.status}
                        </span>
                      </p>
                    )}
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-1">
                          Pickup Time Window
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          placeholder="e.g., 6:00 PM - 8:00 PM"
                          className={`h-11 ${formErrors.pickupTime ? "border-red-500" : ""}`}
                          value={formData.pickupTime}
                          onChange={(e) =>
                            handleChange("pickupTime", e.target.value)
                          }
                        />
                        {formErrors.pickupTime ? (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {formErrors.pickupTime}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500">
                            Specify when customers can pick up their order
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-1">
                          Pickup Location
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          placeholder="e.g., 123 Main Street, City"
                          className={`h-11 ${formErrors.location ? "border-red-500" : ""}`}
                          value={formData.location}
                          onChange={(e) =>
                            handleChange("location", e.target.value)
                          }
                        />
                        {formErrors.location ? (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {formErrors.location}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500">
                            Full address where customers will collect their
                            order
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Auto-filled Info Card */}
            {prefilledData && (
              <Card className="shadow-sm border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-blue-900">
                    Auto-filled Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-xs text-blue-700 font-medium">
                      Item:
                    </span>
                    <span className="text-sm font-semibold text-blue-900">
                      {prefilledData.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-xs text-blue-700 font-medium">
                      Stock:
                    </span>
                    <span className="text-sm font-semibold text-blue-900">
                      {prefilledData.stock} available
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-xs text-blue-700 font-medium">
                      Expires:
                    </span>
                    <span className="text-sm font-semibold text-blue-900">
                      {prefilledData.expiry}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-blue-700 font-medium">
                      Urgency:
                    </span>
                    <span
                      className={`text-sm font-bold uppercase ${
                        prefilledData.status === "critical"
                          ? "text-red-600"
                          : prefilledData.status === "low"
                            ? "text-orange-600"
                            : prefilledData.status === "medium"
                              ? "text-yellow-600"
                              : "text-green-600"
                      }`}
                    >
                      {prefilledData.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Charity Option */}
            <Card className="shadow-sm border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="donation"
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      checked={formData.charityEnabled}
                      onChange={(e) =>
                        handleChange("charityEnabled", e.target.checked)
                      }
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="donation"
                        className="cursor-pointer font-semibold text-sm text-purple-900 flex items-center gap-2"
                      >
                        Enable Charity Donation
                      </Label>
                      <p className="text-xs text-purple-700 mt-1.5 leading-relaxed">
                        Allow NGO partners to claim this listing for assisted
                        customers at no cost. Help those in need while reducing
                        waste.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="shadow-sm bg-gradient-to-br from-green-50 to-green-100/50 border-green-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-green-900 font-semibold">
                  <Info className="h-4 w-4" />
                  💡 Tips for Success
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5 text-xs text-green-800">
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>
                      Use <strong>clear, appetizing photos</strong> to attract
                      customers
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>
                      Be <strong>specific about contents</strong> and quantity
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>
                      Set <strong>realistic pickup windows</strong> (2-3 hours)
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>
                      Price <strong>50-70% off</strong> retail value
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>
                      Update quantity in <strong>real-time</strong> as bags sell
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3 sticky top-6">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Creating Listing...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Publish Listing
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium border-2 hover:bg-gray-100"
                onClick={() => navigate("/panel/vendor/listings")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
