import { AlertCircle, Info } from "lucide-react";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { CreateListingFormData, FormErrors, PrefilledListingData } from "../types";

interface PickupDetailsSectionProps {
  formData: CreateListingFormData;
  formErrors: FormErrors;
  prefilledData?: PrefilledListingData;
  onChange: (field: string, value: string) => void;
}

export function PickupDetailsSection({
  formData,
  formErrors,
  prefilledData,
  onChange,
}: PickupDetailsSectionProps) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Pickup Details</h3>
      {prefilledData?.status && (
        <p className="text-sm text-gray-600 flex items-center gap-1 mb-4">
          <Info className="h-4 w-4" />
          Times suggested based on urgency:{" "}
          <span className="font-medium">{prefilledData.status}</span>
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
            onChange={(e) => onChange("pickupTime", e.target.value)}
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
            onChange={(e) => onChange("location", e.target.value)}
          />
          {formErrors.location ? (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {formErrors.location}
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              Full address where customers will collect their order
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
