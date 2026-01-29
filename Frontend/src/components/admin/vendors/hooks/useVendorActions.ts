import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Vendor, VendorFormData } from "../api/vendors.types";
import { validateForm } from "../utils/vendors.validation";
import { formatPhoneNumber } from "../utils/vendors.helpers";
import { exportToCSV } from "../utils/vendors.helpers";

interface UseVendorActionsProps {
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  selectedVendor: Vendor | null;
  vendorToDelete: Vendor | null;
}

export const useVendorActions = ({
  vendors,
  setVendors,
}: UseVendorActionsProps) => {
  const [formData, setFormData] = useState<VendorFormData>({
    name: "",
    type: "Vendor",
    category: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      type: "Vendor",
      category: "",
      contact: "",
      email: "",
      phone: "",
      address: "",
    });
    setFormErrors({});
  }, []);

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      if (field === "phone") {
        value = formatPhoneNumber(value);
      }
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (formErrors[field]) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [formErrors],
  );

  const addVendor = useCallback(
    (vendorData: VendorFormData) => {
      const { isValid, errors } = validateForm(vendorData);

      if (!isValid) {
        setFormErrors(errors);
        toast.error("Please fix the errors in the form");
        return { success: false };
      }

      const newVendor: Vendor = {
        id: Math.max(...vendors.map((v) => v.id), 0) + 1,
        name: vendorData.name,
        type: vendorData.type,
        category: vendorData.category,
        contact: vendorData.contact,
        email: vendorData.email,
        phone: vendorData.phone,
        address: vendorData.address,
        listings: 0,
        revenue: "$0.00",
        rating: 5.0,
        status: "Active",
      };

      setVendors((prev) => [...prev, newVendor]);
      toast.success(`${vendorData.name} added successfully!`);
      resetForm();

      return { success: true };
    },
    [vendors, setVendors, resetForm],
  );

  const editVendor = useCallback(
    (vendorId: number, vendorData: VendorFormData) => {
      const { isValid, errors } = validateForm(vendorData);

      if (!isValid) {
        setFormErrors(errors);
        toast.error("Please fix the errors in the form");
        return { success: false };
      }

      setVendors((prev) =>
        prev.map((v) =>
          v.id === vendorId
            ? {
                ...v,
                name: vendorData.name,
                type: vendorData.type,
                category: vendorData.category,
                contact: vendorData.contact,
                email: vendorData.email,
                phone: vendorData.phone,
                address: vendorData.address,
              }
            : v,
        ),
      );

      toast.success(`${vendorData.name} updated successfully!`);
      resetForm();

      return { success: true };
    },
    [setVendors, resetForm],
  );

  const deleteVendor = useCallback(
    (vendorId: number) => {
      const vendor = vendors.find((v) => v.id === vendorId);
      if (!vendor) return { success: false };

      setVendors((prev) => prev.filter((v) => v.id !== vendorId));
      toast.success(`${vendor.name} deleted successfully`);

      return { success: true };
    },
    [vendors, setVendors],
  );

  const toggleStatus = useCallback(
    (vendor: Vendor) => {
      const newStatus = vendor.status === "Active" ? "Inactive" : "Active";
      setVendors((prev) =>
        prev.map((v) => (v.id === vendor.id ? { ...v, status: newStatus } : v)),
      );
      toast.success(`${vendor.name} is now ${newStatus}`);

      return { success: true };
    },
    [setVendors],
  );

  const exportVendors = useCallback((vendorsToExport: Vendor[]) => {
    exportToCSV(
      vendorsToExport,
      `vendors-${new Date().toISOString().split("T")[0]}`,
    );
    toast.success("Vendor list exported successfully!");

    return { success: true };
  }, []);

  return {
    formData,
    formErrors,
    setFormData,
    setFormErrors,
    handleInputChange,
    resetForm,
    addVendor,
    editVendor,
    deleteVendor,
    toggleStatus,
    exportVendors,
  };
};
