import { useState, useCallback } from "react";
import { UserFormData } from "../types";
// Import formatting functions from formatters, validation from validators
import { formatPhoneNumber, formatCurrency } from "../utils/formatters";
import { validateForm } from "../utils/validators";

export const useUserForm = (initialData?: Partial<UserFormData>) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    orders: "0",
    totalSpent: "0.00",
    status: "Active",
    joined: new Date().toISOString().split("T")[0],
    lastOrder: "",
    ...initialData,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      if (field === "phone") {
        value = formatPhoneNumber(value);
      }
      if (field === "totalSpent") {
        value = formatCurrency(value);
      }
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error for this field if it exists
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

  const validateCurrentForm = useCallback((): boolean => {
    const errors = validateForm(formData);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const resetForm = useCallback((data?: Partial<UserFormData>) => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      orders: "0",
      totalSpent: "0.00",
      status: "Active",
      joined: new Date().toISOString().split("T")[0],
      lastOrder: "",
      ...data,
    });
    setFormErrors({});
  }, []);

  return {
    formData,
    formErrors,
    handleInputChange,
    validateForm: validateCurrentForm,
    resetForm,
  };
};
