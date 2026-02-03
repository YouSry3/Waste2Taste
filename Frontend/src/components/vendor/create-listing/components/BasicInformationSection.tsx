import { AlertCircle } from "lucide-react";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Textarea } from "../../../ui/textarea";
import { CreateListingFormData, FormErrors } from "../types";

import { ReactNode } from "react";

interface BasicInformationSectionProps {
  formData: CreateListingFormData;
  formErrors: FormErrors;
  onChange: (field: string, value: string) => void;
  categorySelect: ReactNode;
}

export function BasicInformationSection({
  formData,
  formErrors,
  onChange,
  categorySelect,
}: BasicInformationSectionProps) {
  return (
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
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
            onChange={(e) => onChange("vendor", e.target.value)}
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
            onChange={(e) => onChange("title", e.target.value)}
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
          <div className="space-y-2">{categorySelect}</div>
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
            onChange={(e) => onChange("description", e.target.value)}
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
  );
}
