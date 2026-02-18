import { CreateListingFormData, FormErrors } from "../types";

export const validateListingForm = (formData: CreateListingFormData) => {
  const errors: FormErrors = {};

  if (!formData.title.trim()) errors.title = "Title is required";
  if (!formData.vendor.trim()) errors.vendor = "Vendor name is required";
  if (!formData.category) errors.category = "Category is required";
  if (!formData.description.trim())
    errors.description = "Description is required";
  if (!formData.location.trim()) errors.location = "Location is required";
  if (!formData.pickupTime.trim())
    errors.pickupTime = "Pickup time is required";

  const originalPrice = parseFloat(formData.originalPrice);
  const salePrice = parseFloat(formData.salePrice);
  const quantity = parseInt(formData.quantity);

  if (!formData.originalPrice || originalPrice <= 0) {
    errors.originalPrice = "Original price must be greater than 0";
  }
  if (!formData.salePrice || salePrice <= 0) {
    errors.salePrice = "Sale price must be greater than 0";
  }
  if (salePrice >= originalPrice) {
    errors.salePrice = "Sale price must be less than original price";
  }
  if (!formData.quantity || quantity <= 0) {
    errors.quantity = "Quantity must be greater than 0";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
