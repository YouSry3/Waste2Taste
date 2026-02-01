// src/components/admin/listings/index.ts

// Export main component
export { ListingsView } from "./ListingsView";

// Export components
export { ListingCard } from "./components/ListingCard";
export { ListingForm } from "./components/ListingForm";
export { ListingFilters } from "./components/ListingFilters";

// Export API hooks
export {
  useListings,
  useListing,
  useFilteredListings,
  useSearchListings,
  useCategories,
  useListingStats,
} from "./api/listing.queries";

export {
  useCreateListing,
  useUpdateListing,
  useDeleteListing,
} from "./api/listing.mutations";

// Export custom hook
export { useListings as useListingsHook } from "./hooks/useListings";

// Export types - RENAME the type export to avoid conflict
export type {
  Listing,
  CreateListingDto,
  UpdateListingDto,
  ListingFilters as ListingFiltersType, // ← RENAME THIS
  FormField,
} from "./types/listing.types";

// Export utilities
export {
  formatPrice,
  calculateDiscount,
  validateListing,
  transformToApiDto,
  transformFromApiDto,
} from "./utils/listing.utils";
