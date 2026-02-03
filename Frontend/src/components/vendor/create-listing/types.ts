export interface PrefilledListingData {
  name?: string;
  category?: string;
  stock?: number;
  expiry?: string;
  status?: string;
  price?: number;
}

export interface CreateListingProps {
  prefilledData?: PrefilledListingData;
}

export interface CreateListingFormData {
  vendor: string;
  title: string;
  category: string;
  description: string;
  originalPrice: string;
  salePrice: string;
  quantity: string;
  pickupTime: string;
  location: string;
  charityEnabled: boolean;
}

export type FormErrors = Record<string, string>;
