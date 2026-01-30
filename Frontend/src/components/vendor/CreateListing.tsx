// src/components/vendor/listings/CreateListing.tsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "..//ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Upload, Info, X, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

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

  // Get prefilled data from location state or props
  const statePrefilledData = location.state?.prefilledData as
    | PrefilledListingData
    | undefined;
  const prefilledData = propPrefilledData || statePrefilledData;

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    originalPrice: "",
    salePrice: "",
    quantity: "",
    startTime: "",
    endTime: "",
    charityEnabled: false,
  });

  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      }));

      // Auto-set pickup times based on urgency
      const pickupTimes = getPickupTimeSuggestions(prefilledData.status);
      if (pickupTimes) {
        setFormData((prev) => ({
          ...prev,
          startTime: pickupTimes.start,
          endTime: pickupTimes.end,
        }));
      }
    }
  }, [prefilledData]);

  // Helper functions for suggestions
  const getListingSuggestions = (data: PrefilledListingData) => {
    const basePrice = data.price || 15.0;
    const stock = data.stock || 1;

    return {
      title: `${data.name || "Surprise Bag"} - ${getUrgencyLabel(data.status)}`,
      category: data.category || "bakery",
      quantity: stock,
      description: getDescriptionSuggestions(data),
      originalPrice: basePrice.toFixed(2),
      salePrice: (basePrice * 0.3).toFixed(2), // 70% off
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
    const currentHour = now.getHours();

    switch (status) {
      case "critical":
        // If critical, suggest pickup within next 2 hours
        const criticalStart = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
        const criticalEnd = new Date(now.getTime() + 2 * 60 * 60000); // 2 hours from now
        return {
          start: formatTime(criticalStart),
          end: formatTime(criticalEnd),
        };
      case "low":
        // If low urgency, suggest next 3-4 hours
        const lowStart = new Date(now.getTime() + 60 * 60000); // 1 hour from now
        const lowEnd = new Date(now.getTime() + 4 * 60 * 60000); // 4 hours from now
        return {
          start: formatTime(lowStart),
          end: formatTime(lowEnd),
        };
      default:
        // Default: suggest evening pickup (5 PM - 8 PM)
        return {
          start: "17:00",
          end: "20:00",
        };
    }
  };

  const formatTime = (date: Date) => {
    return date.toTimeString().slice(0, 5);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 3); // Limit to 3 images
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Listing created successfully!");
      navigate("/panel/vendor/listings");
    } catch (error) {
      toast.error("Failed to create listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/panel/vendor/listings")}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">
                Create Listing
              </h1>
            </div>
            <p className="text-gray-600 ml-10">
              {prefilledData
                ? `Quick listing for "${prefilledData.name}"`
                : "Add a new surplus food listing for customers"}
            </p>
          </div>

          {prefilledData && (
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                prefilledData.status === "critical"
                  ? "bg-red-100 text-red-800"
                  : prefilledData.status === "low"
                    ? "bg-orange-100 text-orange-800"
                    : prefilledData.status === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
              }`}
            >
              {prefilledData.status?.toUpperCase() || "NEW"}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit}>
              {/* Image Upload */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Listing Photo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <label className="group border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 hover:bg-green-50/50 transition cursor-pointer block">
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2 group-hover:text-green-600" />
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload or drag & drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG or JPG · Max 10MB
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>

                    {/* Preview uploaded images */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Basic Info */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Basic Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Listing Title *
                    </Label>
                    <Input
                      placeholder="e.g., Fresh Bakery Surprise Bag"
                      className="h-10"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange("category", value)}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bakery">🥖 Bakery</SelectItem>
                        <SelectItem value="prepared">
                          🍱 Prepared Food
                        </SelectItem>
                        <SelectItem value="produce">🥗 Produce</SelectItem>
                        <SelectItem value="dairy">🥛 Dairy</SelectItem>
                        <SelectItem value="other">📦 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Description *</Label>
                    <Textarea
                      rows={4}
                      placeholder="Describe what customers can expect..."
                      className="resize-none"
                      value={formData.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">
                    Pricing & Availability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Original Price *
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-7 h-10"
                          value={formData.originalPrice}
                          onChange={(e) =>
                            handleChange("originalPrice", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Sale Price *
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-7 h-10"
                          value={formData.salePrice}
                          onChange={(e) =>
                            handleChange("salePrice", e.target.value)
                          }
                          required
                        />
                      </div>
                      {formData.originalPrice && formData.salePrice && (
                        <p className="text-xs text-green-600">
                          {Math.round(
                            (1 -
                              parseFloat(formData.salePrice) /
                                parseFloat(formData.originalPrice)) *
                              100,
                          )}
                          % off retail price
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Available Quantity *
                    </Label>
                    <Input
                      type="number"
                      placeholder="How many bags available?"
                      className="h-10"
                      value={formData.quantity}
                      onChange={(e) => handleChange("quantity", e.target.value)}
                      required
                    />
                    {prefilledData?.stock && (
                      <p className="text-xs text-gray-500">
                        Based on available stock: {prefilledData.stock} items
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Pickup Time */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Pickup Window</CardTitle>
                  {prefilledData?.status && (
                    <p className="text-sm text-gray-600">
                      Suggested times based on urgency: {prefilledData.status}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Start Time *
                      </Label>
                      <Input
                        type="time"
                        className="h-10"
                        value={formData.startTime}
                        onChange={(e) =>
                          handleChange("startTime", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">End Time *</Label>
                      <Input
                        type="time"
                        className="h-10"
                        value={formData.endTime}
                        onChange={(e) =>
                          handleChange("endTime", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Auto-filled Info Card */}
            {prefilledData && (
              <Card className="shadow-sm border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">
                    Auto-filled Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Item:</span>
                    <span className="text-sm font-medium">
                      {prefilledData.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Stock:</span>
                    <span className="text-sm font-medium">
                      {prefilledData.stock} available
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Expires:</span>
                    <span className="text-sm font-medium">
                      {prefilledData.expiry}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Urgency:</span>
                    <span
                      className={`text-sm font-medium ${
                        prefilledData.status === "critical"
                          ? "text-red-600"
                          : prefilledData.status === "low"
                            ? "text-orange-600"
                            : prefilledData.status === "medium"
                              ? "text-yellow-600"
                              : "text-green-600"
                      }`}
                    >
                      {prefilledData.status?.toUpperCase()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Charity Option */}
            <Card className="shadow-sm border-blue-200 bg-blue-50/50">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="donation"
                      className="mt-1 h-4 w-4 rounded border-gray-300"
                      checked={formData.charityEnabled}
                      onChange={(e) =>
                        handleChange("charityEnabled", e.target.checked)
                      }
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="donation"
                        className="cursor-pointer font-medium text-sm"
                      >
                        Enable charity donation
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        Allow NGO partners to claim this listing for assisted
                        customers at no cost.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="shadow-sm bg-green-50/50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Tips for Success
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-green-600">•</span>
                    <span>Use clear, appetizing photos</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">•</span>
                    <span>Be specific about contents</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">•</span>
                    <span>Set realistic pickup windows</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">•</span>
                    <span>Price 50-70% off retail value</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 h-11"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Publish Listing"}
              </Button>
              <Button
                variant="outline"
                className="w-full h-11"
                onClick={() => navigate("/panel/vendor/listings")}
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
