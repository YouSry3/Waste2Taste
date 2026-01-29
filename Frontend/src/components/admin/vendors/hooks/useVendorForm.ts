import { useState, useCallback } from "react";
import { VendorFormData, FormErrors } from "../components/api/vendors.types";
import {
  validateEmail,
  validatePhone,
  formatPhoneNumber,
} from "../utils/vendors.validation";

export const useVendorForm = (initialData?: VendorFormData) => {
  const [formData, setFormData] = useState<VendorFormData>(
    initialData || {
      name: "",
      type: "Vendor",
      category: "",
      contact: "",
      email: "",
      phone: "",
      address: "",
    },
  );

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleInputChange = useCallback(
    (field: keyof VendorFormData, value: string) => {
      if (field === "phone") {
        value = formatPhoneNumber(value);
      }

      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error for this field when user starts typing
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

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) errors.name = "Business name is required";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.contact.trim()) errors.contact = "Contact person is required";

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!validatePhone(formData.phone)) {
      errors.phone = "Invalid phone format (555) 123-4567";
    }

    if (!formData.address.trim()) errors.address = "Address is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

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

  const setFormDataFromVendor = useCallback((vendor: VendorFormData) => {
    setFormData(vendor);
  }, []);

  return {
    formData,
    formErrors,
    handleInputChange,
    validateForm,
    resetForm,
    setFormData,
    setFormDataFromVendor,
    setFormErrors,
  };
};
