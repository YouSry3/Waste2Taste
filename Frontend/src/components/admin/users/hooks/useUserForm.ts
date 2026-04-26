import { useState, useCallback } from "react";
import { UserFormData } from "../types";
// Import formatting functions from formatters, validation from validators
import { formatPhoneNumber, formatCurrency } from "../utils/formatters";
import { validateForm } from "../utils/validators";

export const useUserForm = (initialData?: Partial<UserFormData>) => {
  const [formData, setFormData] = useState<UserFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    ordersCount: "0",
    totalSpent: "0.00",
    isActive: true,
    joinedAt: new Date().toISOString().split("T")[0],
    lastOrderDate: "",
    ...initialData,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      let processedValue: any = value;

      if (field === "phoneNumber") {
        processedValue = formatPhoneNumber(value);
      }
      if (field === "totalSpent") {
        processedValue = formatCurrency(value);
      }
      if (field === "isActive") {
        processedValue = value === "true";
      }

      setFormData((prev) => ({ ...prev, [field]: processedValue }));

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
      fullName: "",
      email: "",
      phoneNumber: "",
      ordersCount: "0",
      totalSpent: "0.00",
      isActive: true,
      joinedAt: new Date().toISOString().split("T")[0],
      lastOrderDate: "",
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
