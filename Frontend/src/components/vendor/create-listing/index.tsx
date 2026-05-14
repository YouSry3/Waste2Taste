import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { AlertCircle, Lock } from "lucide-react";
import { ActionsPanel } from "./components/ActionsPanel";
import { BasicInformationSection } from "./components/BasicInformationSection";
import { ImageUploadSection } from "./components/ImageUploadSection";
import { PageHeader } from "./components/PageHeader";
import { PrefilledInfoCard } from "./components/PrefilledInfoCard";
import { PricingAvailabilitySection } from "./components/PricingAvailabilitySection";
import { TipsCard } from "./components/TipsCard";
import { useImagePreviews } from "./hooks/useImagePreviews";
import {
  CreateListingFormData,
  CreateListingProps,
  FormErrors,
  PrefilledListingData,
} from "./types";
import { getListingSuggestions } from "./utils/listingSuggestions";
import { validateListingForm } from "./utils/validation";
import { useCreateListing } from "../listings/api/listing.mutations";
import { apiClient } from "../../../services/api/apiClient";
import { vendorApiClient } from "../../../services/vendor/vendorDashboardApi";
import { authService } from "../../../services/auth/authService";
const defaultFormData: CreateListingFormData = {
  title: "",
  description: "",
  originalPrice: "",
  salePrice: "",
  quantity: "",
  expiryDate: "",
};

export function CreateListing({ prefilledData: propPrefilledData }: CreateListingProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync: createListing, isPending } = useCreateListing();

  const statePrefilledData = location.state?.prefilledData as PrefilledListingData | undefined;
  const prefilledData = propPrefilledData || statePrefilledData;

  // Vendor info from DB — locked, not editable
  const [vendorInfo, setVendorInfo] = useState<{
    id: string;
    name: string;
    category: string;
  } | null>(null);
  const [vendorLoading, setVendorLoading] = useState(true);

  const [formData, setFormData] = useState<CreateListingFormData>(defaultFormData);
  const [images, setImages] = useState<File[]>([]);
  const imagePreviews = useImagePreviews(images);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Fetch vendor info from DB on mount
  useEffect(() => {
    const fetchVendorInfo = async () => {
      try {
        const user = authService.getCurrentUser();
       const res = await vendorApiClient.get("/User/vendors");
        const list: any[] = res.data?.value ?? res.data?.data ?? res.data?.items ?? [];
        const vendor = list.find(
          (v: any) =>
            (v.email ?? "").toLowerCase() === (user?.email ?? "").toLowerCase()
        ) ?? list[0];

        if (vendor) {
          setVendorInfo({
            id: vendor.id ?? "",
            name: vendor.name ?? vendor.businessName ?? "",
            category: vendor.category ?? "",
          });
        }
      } catch (err) {
        console.error("Failed to load vendor info:", err);
        toast.error("Could not load your vendor information");
      } finally {
        setVendorLoading(false);
      }
    };
    fetchVendorInfo();
  }, []);

  // Pre-fill from suggestions if navigated from inventory
  useEffect(() => {
    if (!prefilledData) return;
    const suggestions = getListingSuggestions(prefilledData);
    setFormData((prev) => ({
      ...prev,
      title: suggestions.title,
      quantity: suggestions.quantity.toString(),
      description: suggestions.description,
      salePrice: suggestions.salePrice.toString(),
      originalPrice: suggestions.originalPrice.toString(),
    }));
  }, [prefilledData]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const newImages = Array.from(files).slice(0, 3 - images.length);
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (event?: React.SyntheticEvent) => {
    event?.preventDefault();

    if (!vendorInfo?.id) {
      toast.error("Vendor information not loaded. Please try again.");
      return;
    }

    const { errors, isValid } = validateListingForm(formData);
    if (!isValid) {
      setFormErrors(errors);
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
     await createListing({
  VendorId: vendorInfo.id,
  Name: formData.title,
  Description: formData.description,
  Category: vendorInfo.category, // ← ADD THIS
  Price: parseFloat(formData.salePrice),
  OriginalPrice: parseFloat(formData.originalPrice),
  Quantity: parseInt(formData.quantity),
  ExpiryDate: new Date(formData.expiryDate).toISOString(),
  ImageFile: images[0] ?? null,
});

      toast.success("Listing submitted! Awaiting admin approval.");
      setTimeout(() => navigate("/panel/vendor/listings"), 1200);
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to submit listing");
    }
  };

  const discountPercentage =
    formData.originalPrice && formData.salePrice
      ? Math.round(
          (1 - parseFloat(formData.salePrice) / parseFloat(formData.originalPrice)) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Toaster position="top-center" />
      <div className="max-w-5xl mx-auto">
        <PageHeader
          prefilledData={prefilledData}
          onBack={() => navigate("/panel/vendor/listings")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="shadow-sm border-gray-200 overflow-hidden">
                <div className="space-y-0">
                  <ImageUploadSection
                    images={images}
                    imagePreviews={imagePreviews}
                    onUpload={handleImageUpload}
                    onRemove={removeImage}
                  />

                  {/* Locked vendor info from DB */}
                  <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      Store Information
                      <Lock className="h-4 w-4 text-gray-400" />
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600">
                          Store Name
                        </Label>
                        <Input
                          value={vendorLoading ? "Loading..." : (vendorInfo?.name ?? "—")}
                          disabled
                          className="bg-white border-gray-200 text-gray-700 cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600">
                          Category
                        </Label>
                        <Input
                          value={vendorLoading ? "Loading..." : (vendorInfo?.category ?? "—")}
                          disabled
                          className="bg-white border-gray-200 text-gray-700 cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      These fields come from your account and cannot be changed here.
                    </p>
                  </div>

                  {/* Title + Description only — vendor/category removed */}
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Listing Details</h3>
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-1">
                          Listing Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          placeholder="e.g., Strawberry"
                          className={`h-11 ${formErrors.title ? "border-red-500" : ""}`}
                          value={formData.title}
                          onChange={(e) => handleChange("title", e.target.value)}
                          maxLength={100}
                        />
                        {formErrors.title && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {formErrors.title}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-1">
                          Description <span className="text-red-500">*</span>
                        </Label>
                        <textarea
                          rows={5}
                          placeholder="Describe what customers can expect..."
                          className={`w-full rounded-md border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            formErrors.description ? "border-red-500" : "border-gray-200"
                          }`}
                          value={formData.description}
                          onChange={(e) => handleChange("description", e.target.value)}
                          maxLength={500}
                        />
                        {formErrors.description && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {formErrors.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <PricingAvailabilitySection
                    formData={formData}
                    formErrors={formErrors}
                    discountPercentage={discountPercentage}
                    prefilledData={prefilledData}
                    onChange={(field, value) => handleChange(field, value)}
                  />

                  {/* Expiry Date */}
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Expiry Date</h3>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-1">
                        Expiry Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="date"
                        className={`h-11 ${formErrors.expiryDate ? "border-red-500" : ""}`}
                        value={formData.expiryDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => handleChange("expiryDate", e.target.value)}
                      />
                      {formErrors.expiryDate && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {formErrors.expiryDate}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </form>
          </div>

          <div className="space-y-6">
            {prefilledData && <PrefilledInfoCard prefilledData={prefilledData} />}
            <TipsCard />
            <ActionsPanel
              isSubmitting={isPending}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/panel/vendor/listings")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}