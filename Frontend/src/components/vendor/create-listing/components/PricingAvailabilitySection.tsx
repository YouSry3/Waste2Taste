import { AlertCircle, Check } from "lucide-react";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { CreateListingFormData, FormErrors, PrefilledListingData } from "../types";

interface PricingAvailabilitySectionProps {
  formData: CreateListingFormData;
  formErrors: FormErrors;
  discountPercentage: number;
  prefilledData?: PrefilledListingData;
  onChange: (field: string, value: string) => void;
}

export function PricingAvailabilitySection({
  formData,
  formErrors,
  discountPercentage,
  prefilledData,
  onChange,
}: PricingAvailabilitySectionProps) {
  return (
    <div className="p-6 border-b border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Pricing & Availability</h3>
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
                onChange={(e) => onChange("originalPrice", e.target.value)}
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
                onChange={(e) => onChange("salePrice", e.target.value)}
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
            onChange={(e) => onChange("quantity", e.target.value)}
          />
          {formErrors.quantity ? (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {formErrors.quantity}
            </p>
          ) : prefilledData?.stock ? (
            <p className="text-xs text-gray-500">
              Based on available stock: {prefilledData.stock} items
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              Number of surprise bags customers can purchase
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
