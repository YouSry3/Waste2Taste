export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
  return phoneRegex.test(phone);
};

// REMOVE THESE DUPLICATE FUNCTIONS - THEY ARE IN formatters.ts
// export const formatPhoneNumber = (value: string): string => {
//   const numbers = value.replace(/\D/g, "");
//   if (numbers.length <= 3) return numbers;
//   if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
//   return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
// };

// export const formatCurrency = (value: string): string => {
//   // Remove any existing dollar signs and non-numeric characters except decimal point
//   const cleaned = value.replace(/[^\d.]/g, "");

//   // If empty or just a decimal point, return empty
//   if (!cleaned || cleaned === ".") return value;

//   // Parse as number
//   const number = parseFloat(cleaned);

//   // If not a valid number, return original value
//   if (isNaN(number)) return value;

//   // Format with 2 decimal places and add dollar sign
//   return `$${number.toFixed(2)}`;
// };

export const validateForm = (formData: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!formData.fullName?.trim()) errors.fullName = "Full name is required";
  if (!formData.email?.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(formData.email)) {
    errors.email = "Invalid email format";
  }
  if (!formData.phoneNumber?.trim()) {
    errors.phoneNumber = "Phone is required";
  } else if (!validatePhone(formData.phoneNumber)) {
    errors.phoneNumber = "Invalid phone format (555) 123-4567";
  }
  if (!formData.ordersCount?.trim()) {
    errors.ordersCount = "Orders count is required";
  } else if (isNaN(Number(formData.ordersCount)) || Number(formData.ordersCount) < 0) {
    errors.ordersCount = "Orders count must be a positive number";
  }
  if (!formData.totalSpent?.trim()) {
    errors.totalSpent = "Total spent is required";
  } else if (
    isNaN(Number(formData.totalSpent.replace(/[$,]/g, ""))) ||
    Number(formData.totalSpent.replace(/[$,]/g, "")) < 0
  ) {
    errors.totalSpent = "Total spent must be a positive number";
  }
  if (!formData.lastOrderDate?.trim()) {
    errors.lastOrderDate = "Last order date is required";
  }

  return errors;
};

export const validateBulkAction = (
  userIds: string[],
  action: string,
): string | null => {
  if (userIds.length === 0) {
    return "Please select at least one user";
  }
  if (!["activate", "deactivate", "delete"].includes(action)) {
    return "Invalid action";
  }
  return null;
};
