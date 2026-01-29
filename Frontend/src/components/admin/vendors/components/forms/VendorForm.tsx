import { Label } from "../../../../ui/label";
import { Input } from "../../../../ui/input";
import { Button } from "../../../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import { CATEGORIES } from "../../constants/vendors.data";

interface VendorFormProps {
  formData: {
    name: string;
    type: "Vendor" | "NGO Partner";
    category: string;
    contact: string;
    email: string;
    phone: string;
    address: string;
  };
  formErrors: Record<string, string>;
  handleInputChange: (field: string, value: string) => void;
  onSubmit: () => void;
  submitText: string;
  onCancel?: () => void;
}

export function VendorForm({
  formData,
  formErrors,
  handleInputChange,
  onSubmit,
  submitText,
  onCancel,
}: VendorFormProps) {
  return (
    <div className="space-y-4 py-4">
      <div>
        <Label className="text-sm font-medium">Business Name *</Label>
        <Input
          placeholder="Enter business name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className={`mt-1 ${formErrors.name ? "border-red-500" : ""}`}
        />
        {formErrors.name && (
          <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium">Type *</Label>
        <Select
          value={formData.type}
          onValueChange={(value: "Vendor" | "NGO Partner") =>
            handleInputChange("type", value)
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border rounded-md shadow-lg z-50">
            <SelectItem value="Vendor">Vendor</SelectItem>
            <SelectItem value="NGO Partner">NGO Partner</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleInputChange("category", value)}
        >
          <SelectTrigger
            className={`mt-1 ${formErrors.category ? "border-red-500" : ""}`}
          >
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border rounded-md shadow-lg z-50">
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors.category && (
          <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium">Contact Person *</Label>
        <Input
          placeholder="Enter contact name"
          value={formData.contact}
          onChange={(e) => handleInputChange("contact", e.target.value)}
          className={`mt-1 ${formErrors.contact ? "border-red-500" : ""}`}
        />
        {formErrors.contact && (
          <p className="text-red-500 text-xs mt-1">{formErrors.contact}</p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium">Email *</Label>
        <Input
          type="email"
          placeholder="email@example.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className={`mt-1 ${formErrors.email ? "border-red-500" : ""}`}
        />
        {formErrors.email && (
          <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium">Phone *</Label>
        <Input
          type="tel"
          placeholder="(555) 123-4567"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          className={`mt-1 ${formErrors.phone ? "border-red-500" : ""}`}
          maxLength={14}
        />
        {formErrors.phone && (
          <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium">Address *</Label>
        <Input
          placeholder="Enter business address"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          className={`mt-1 ${formErrors.address ? "border-red-500" : ""}`}
        />
        {formErrors.address && (
          <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        {onCancel && (
          <Button
            className="flex-1 hover:bg-red-50 hover:text-red-700 text-red-600"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          className={`${onCancel ? "flex-1" : "w-full"} bg-green-600 hover:bg-green-700 text-white`}
          onClick={onSubmit}
        >
          {submitText}
        </Button>
      </div>
    </div>
  );
}
