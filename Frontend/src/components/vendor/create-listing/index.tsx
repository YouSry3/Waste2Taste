import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Card } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { useVendorListings } from "../listings/context/ListingsContext";
import { ActionsPanel } from "./components/ActionsPanel";
import { BasicInformationSection } from "./components/BasicInformationSection";
import { ImageUploadSection } from "./components/ImageUploadSection";
import { PageHeader } from "./components/PageHeader";
import { PickupDetailsSection } from "./components/PickupDetailsSection";
import { PrefilledInfoCard } from "./components/PrefilledInfoCard";
import { PricingAvailabilitySection } from "./components/PricingAvailabilitySection";
import { TipsCard } from "./components/TipsCard";
import { useImagePreviews } from "./hooks/useImagePreviews";
import { CreateListingFormData, CreateListingProps, FormErrors, PrefilledListingData } from "./types";
import { getListingSuggestions } from "./utils/listingSuggestions";
import { validateListingForm } from "./utils/validation";

const defaultFormData: CreateListingFormData = {
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
};

export function CreateListing({
  prefilledData: propPrefilledData,
}: CreateListingProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { createListing } = useVendorListings();

  const statePrefilledData = location.state?.prefilledData as
    | PrefilledListingData
    | undefined;
  const prefilledData = propPrefilledData || statePrefilledData;

  const [formData, setFormData] = useState<CreateListingFormData>(
    defaultFormData,
  );
  const [images, setImages] = useState<File[]>([]);
  const imagePreviews = useImagePreviews(images);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!prefilledData) return;

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
        const nextErrors = { ...prev };
        delete nextErrors[field];
        return nextErrors;
      });
    }
  };

  const handleSubmit = async (event?: React.SyntheticEvent) => {
    event?.preventDefault();

    const { errors, isValid } = validateListingForm(formData);
    if (!isValid) {
      setFormErrors(errors);
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const photoPromises = images.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
          }),
      );

      const photos = await Promise.all(photoPromises);

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
        photos: photos,
      });

      console.log("New listing created:", newListing);

      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success("Listing created successfully!");

      setTimeout(() => {
        navigate("/panel/vendor/listings");
      }, 1000);
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to create listing");
      setIsSubmitting(false);
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

                  <BasicInformationSection
                    formData={formData}
                    formErrors={formErrors}
                    onChange={(field, value) => handleChange(field, value)}
                    categorySelect={
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
                          <SelectItem value="Bakery">Bakery</SelectItem>
                          <SelectItem value="Restaurant">
                            Restaurant
                          </SelectItem>
                          <SelectItem value="Cafe">Cafe</SelectItem>
                          <SelectItem value="Grocery">
                          Grocery
                          </SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    }
                  />

                  <PricingAvailabilitySection
                    formData={formData}
                    formErrors={formErrors}
                    discountPercentage={discountPercentage}
                    prefilledData={prefilledData}
                    onChange={(field, value) => handleChange(field, value)}
                  />

                  <PickupDetailsSection
                    formData={formData}
                    formErrors={formErrors}
                    prefilledData={prefilledData}
                    onChange={(field, value) => handleChange(field, value)}
                  />
                </div>
              </Card>
            </form>
          </div>

          <div className="space-y-6">
            {prefilledData && <PrefilledInfoCard prefilledData={prefilledData} />}
            <TipsCard />
            <ActionsPanel
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/panel/vendor/listings")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
