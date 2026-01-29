// src/components/admin/listings/utils/listing.utils.ts

/**
 * Utility functions for listing operations
 * TODO: Add any additional utility functions needed
 */

// Format price for display
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
};

// Calculate discount percentage
export const calculateDiscount = (
  originalPrice: number,
  salePrice: number,
): number => {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

// Format date/time for display
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Validate listing data before submission
export const validateListing = (
  listing: any,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!listing.title?.trim()) errors.push("Title is required");
  if (!listing.vendor?.trim()) errors.push("Vendor is required");
  if (listing.originalPrice <= 0)
    errors.push("Original price must be greater than 0");
  if (listing.salePrice <= 0) errors.push("Sale price must be greater than 0");
  if (listing.salePrice > listing.originalPrice)
    errors.push("Sale price cannot be greater than original price");
  if (listing.quantity < 0) errors.push("Quantity cannot be negative");
  if (!listing.pickupTime?.trim()) errors.push("Pickup time is required");
  if (!listing.location?.trim()) errors.push("Location is required");
  if (!listing.category?.trim()) errors.push("Category is required");

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Generate mock ID (for development only)
export const generateMockId = (): number => {
  return Math.floor(Math.random() * 1000000);
};

// Transform form data to API DTO
export const transformToApiDto = (formData: any): any => {
  return {
    ...formData,
    // Add any transformations needed
    originalPrice: parseFloat(formData.originalPrice),
    salePrice: parseFloat(formData.salePrice),
    quantity: parseInt(formData.quantity, 10),
    rating: parseFloat(formData.rating) || 0,
  };
};

// Transform API response to form data
export const transformFromApiDto = (apiData: any): any => {
  return {
    ...apiData,
    // Add any transformations needed
  };
};
