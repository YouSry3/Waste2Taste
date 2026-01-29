// src/components/admin/listings/types/listing.types.ts
export interface Listing {
  id: number;
  vendor: string;
  title: string;
  category: string;
  originalPrice: number;
  salePrice: number;
  quantity: number;
  pickupTime: string;
  status: "Active" | "Sold Out";
  location: string;
  rating: number;
  description: string;
}

// DTOs (Data Transfer Objects) for API requests
export interface CreateListingDto {
  vendor: string;
  title: string;
  category: string;
  originalPrice: number;
  salePrice: number;
  quantity: number;
  pickupTime: string;
  location: string;
  description: string;
  status?: "Active" | "Sold Out";
  rating?: number;
}

export interface UpdateListingDto extends Partial<CreateListingDto> {
  // Partial update - all fields optional
}

export interface ListingFilters {
  searchTerm?: string;
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

// Component props types
export interface FormField {
  label: string;
  key: string;
  placeholder: string;
  type?: string;
  isTextarea?: boolean;
}

export interface ListingFormProps {
  formState: Partial<Listing>;
  setFormState: (state: Partial<Listing>) => void;
  formFields: FormField[];
  onSubmit: () => void;
  submitLabel: string;
}

export interface ListingCardProps {
  listing: Listing;
  onEdit: (listing: Listing) => void;
  onView: (listing: Listing) => void;
  onDelete: (id: number) => void;
}
