import { Label } from "../../../../../components/ui/label";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { UserFormData } from "../../types";

interface UserFormProps {
  formData: UserFormData;
  formErrors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  submitLabel: string;
}

export function UserForm({
  formData,
  formErrors,
  onInputChange,
  onSubmit,
  onCancel,
  submitLabel,
}: UserFormProps) {
  return (
    <div className="space-y-4 py-4">
      <div>
        <Label className="text-sm font-medium">Full Name *</Label>
        <Input
          placeholder="Enter full name"
          value={formData.name}
          onChange={(e) => onInputChange("name", e.target.value)}
          className={`mt-1 ${formErrors.name ? "border-red-500" : ""}`}
        />
        {formErrors.name && (
          <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium">Email *</Label>
        <Input
          type="email"
          placeholder="email@example.com"
          value={formData.email}
          onChange={(e) => onInputChange("email", e.target.value)}
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
          onChange={(e) => onInputChange("phone", e.target.value)}
          className={`mt-1 ${formErrors.phone ? "border-red-500" : ""}`}
          maxLength={14}
        />
        {formErrors.phone && (
          <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Orders *</Label>
          <Input
            type="number"
            placeholder="0"
            value={formData.orders}
            onChange={(e) => onInputChange("orders", e.target.value)}
            className={`mt-1 ${formErrors.orders ? "border-red-500" : ""}`}
            min="0"
          />
          {formErrors.orders && (
            <p className="text-red-500 text-xs mt-1">{formErrors.orders}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium">Total Spent *</Label>
          <Input
            placeholder="$0.00"
            value={formData.totalSpent}
            onChange={(e) => onInputChange("totalSpent", e.target.value)}
            className={`mt-1 ${formErrors.totalSpent ? "border-red-500" : ""}`}
          />
          {formErrors.totalSpent && (
            <p className="text-red-500 text-xs mt-1">{formErrors.totalSpent}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Status</Label>
          <select
            value={formData.status}
            onChange={(e) => onInputChange("status", e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div>
          <Label className="text-sm font-medium">Joined Date</Label>
          <Input
            type="date"
            value={formData.joined}
            onChange={(e) => onInputChange("joined", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Last Order Date *</Label>
        <Input
          type="date"
          value={formData.lastOrder}
          onChange={(e) => onInputChange("lastOrder", e.target.value)}
          className={`mt-1 ${formErrors.lastOrder ? "border-red-500" : ""}`}
        />
        {formErrors.lastOrder && (
          <p className="text-red-500 text-xs mt-1">{formErrors.lastOrder}</p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        {onCancel && (
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          className={`${onCancel ? "flex-1" : "w-full"} bg-green-600 hover:bg-green-700 text-white`}
          onClick={onSubmit}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
