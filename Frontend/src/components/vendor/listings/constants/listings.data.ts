// src/components/admin/listings/constants/listings.data.ts
import { Listing } from "../types/listing.types";
// Sample photo URLs (you can use base64 or actual URLs)
const samplePhoto1 =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U1ZTVlNSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiPkJha2VyeSBCYWc8L3RleHQ+PC9zdmc+";
const samplePhoto2 =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiPkNvZmZlZSAmIFBhc3RyaWVzPC90ZXh0Pjwvc3ZnPg==";
export const initialListings: Listing[] = [
  {
    id: 1,
    vendor: "Green Valley Bakery",
    title: "Bakery Surprise Bag",
    category: "Bakery",
    originalPrice: 15.0,
    salePrice: 4.99,
    quantity: 5,
    pickupTime: "6:00 PM - 7:00 PM",
    status: "Active",
    location: "123 Valley Road",
    rating: 4.8,
    description: "Fresh bakery items included.",
    photos: [samplePhoto1], // Add photos
  },
  {
    id: 2,
    vendor: "City Cafe",
    title: "Coffee & Pastries",
    category: "Cafe",
    originalPrice: 18.0,
    salePrice: 5.99,
    quantity: 3,
    pickupTime: "8:00 PM - 9:00 PM",
    status: "Active",
    location: "456 Main Street",
    rating: 4.6,
    description: "Delicious coffee with fresh pastries.",
    photos: [samplePhoto2], // Add photos
  },
];

// Add this export - statusColors was missing
export const statusColors: Record<
  string,
  "default" | "secondary" | "destructive"
> = {
  Active: "default",
  "Sold Out": "destructive",
  Expired: "destructive",
  Pending: "secondary",
};

export const formFields = [
  { label: "Vendor", key: "vendor", placeholder: "e.g. Green Valley Bakery" },
  { label: "Title", key: "title", placeholder: "e.g. Bakery Surprise Bag" },
  {
    label: "Original Price",
    key: "originalPrice",
    type: "number",
    placeholder: "e.g. 15.00",
  },
  {
    label: "Sale Price",
    key: "salePrice",
    type: "number",
    placeholder: "e.g. 4.99",
  },
  {
    label: "Quantity",
    key: "quantity",
    type: "number",
    placeholder: "e.g. 5",
  },
  {
    label: "Pickup Time",
    key: "pickupTime",
    placeholder: "e.g. 6:00 PM - 7:00 PM",
  },
  { label: "Location", key: "location", placeholder: "e.g. 123 Valley Road" },
  {
    label: "Description",
    key: "description",
    isTextarea: true,
    placeholder: "Short description...",
  },
];

// Optional: Add more constants if needed
export const CATEGORIES = ["Bakery", "Restaurant", "Cafe", "Grocery", "Other"];
export const STATUS_OPTIONS = ["Active", "Sold Out", "Pending", "Expired"];
