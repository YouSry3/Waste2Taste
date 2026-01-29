import { FormErrors } from "../api/vendors.types";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
  return phoneRegex.test(phone);
};

// ADD THIS FUNCTION:
export const formatPhoneNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6)
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
};

export const validateForm = (
  formData: Record<string, string>,
): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};

  if (!formData.name?.trim()) errors.name = "Business name is required";
  if (!formData.category) errors.category = "Category is required";
  if (!formData.contact?.trim()) errors.contact = "Contact person is required";

  if (!formData.email?.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(formData.email)) {
    errors.email = "Invalid email format";
  }

  if (!formData.phone?.trim()) {
    errors.phone = "Phone is required";
  } else if (!validatePhone(formData.phone)) {
    errors.phone = "Invalid phone format (555) 123-4567";
  }

  if (!formData.address?.trim()) errors.address = "Address is required";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
