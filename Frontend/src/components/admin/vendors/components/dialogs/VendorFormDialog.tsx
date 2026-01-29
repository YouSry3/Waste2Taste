import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../ui/dialog";
import { VendorForm } from "../forms/VendorForm";
import { Vendor, VendorFormData } from "../../api/vendors.types";
import { FormErrors } from "../../api/vendors.types";

interface VendorFormDialogProps {
  type: "add" | "edit";
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  vendor?: Vendor | null;
  formData: VendorFormData;
  formErrors: FormErrors;
  handleInputChange: (field: string, value: string) => void;
  resetForm: () => void;
}

export function VendorFormDialog({
  type,
  isOpen,
  onClose,
  onSubmit,
  vendor,
  formData,
  formErrors,
  handleInputChange,
  resetForm,
}: VendorFormDialogProps) {
  const title = type === "add" ? "Add New Vendor" : "Edit Vendor";
  const submitText = type === "add" ? "Add Vendor" : "Save Changes";

  // Reset form when add dialog opens
  useEffect(() => {
    if (type === "add" && isOpen) {
      resetForm();
    }
  }, [type, isOpen, resetForm]);

  // Auto-fill form when edit dialog opens with a vendor
  useEffect(() => {
    if (type === "edit" && isOpen && vendor) {
      // Ensure form is filled with vendor data
      handleInputChange("name", vendor.name);
      handleInputChange("type", vendor.type);
      handleInputChange("category", vendor.category);
      handleInputChange("contact", vendor.contact);
      handleInputChange("email", vendor.email);
      handleInputChange("phone", vendor.phone);
      handleInputChange("address", vendor.address);
    }
  }, [type, isOpen, vendor, handleInputChange]);

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <VendorForm
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
          onSubmit={onSubmit}
          submitText={submitText}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
