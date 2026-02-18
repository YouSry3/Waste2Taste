import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { Listing } from "../types/listing.types";

// Sample initial data with photos
const samplePhoto1 =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U1ZTVlNSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiPkJha2VyeSBCYWc8L3RleHQ+PC9zdmc+";
const samplePhoto2 =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiPkNvZmZlZSAmIFBhc3RyaWVzPC90ZXh0Pjwvc3ZnPg==";

const initialListings: Listing[] = [
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
    description:
      "Fresh bakery items included. Assortment of bread, pastries, and desserts.",
    photos: [samplePhoto1],
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
    description:
      "Delicious coffee with fresh pastries. Perfect end-of-day deal.",
    photos: [samplePhoto2],
  },
];

interface VendorListingsContextType {
  listings: Listing[];
  searchTerm: string;
  filterCategory: string;
  filterStatus: string;
  setSearchTerm: (term: string) => void;
  setFilterCategory: (category: string) => void;
  setFilterStatus: (status: string) => void;
  createListing: (data: Partial<Listing>) => Listing;
  updateListing: (id: number | string, data: Partial<Listing>) => void;
  deleteListing: (id: number | string) => void;
  filteredListings: Listing[];
}

const VendorListingsContext = createContext<
  VendorListingsContextType | undefined
>(undefined);

export function VendorListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesSearch =
        searchTerm === "" ||
        listing.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        filterCategory === "all" || listing.category === filterCategory;

      const matchesStatus =
        filterStatus === "all" || listing.status === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [listings, searchTerm, filterCategory, filterStatus]);

  const createListing = (data: Partial<Listing>) => {
    const newListing: Listing = {
      ...(data as Listing),
      id: Date.now(),
      status: data.status || "Active",
      rating: data.rating || 4.5,
      photos: data.photos || [],
    };

    console.log(
      "Creating new listing with photos:",
      data.photos?.length || 0,
      "photos",
    );

    setListings((prev) => {
      const updatedListings = [newListing, ...prev];
      console.log("Updated listings total:", updatedListings.length);
      return updatedListings;
    });
    return newListing;
  };

  const updateListing = (id: number | string, data: Partial<Listing>) => {
    setListings((prev) =>
      prev.map((listing) =>
        listing.id === id ? { ...listing, ...data } : listing,
      ),
    );
  };

  const deleteListing = (id: number | string) => {
    setListings((prev) => prev.filter((listing) => listing.id !== id));
  };

  return (
    <VendorListingsContext.Provider
      value={{
        listings,
        searchTerm,
        filterCategory,
        filterStatus,
        setSearchTerm,
        setFilterCategory,
        setFilterStatus,
        createListing,
        updateListing,
        deleteListing,
        filteredListings,
      }}
    >
      {children}
    </VendorListingsContext.Provider>
  );
}

export function useVendorListings() {
  const context = useContext(VendorListingsContext);
  if (context === undefined) {
    throw new Error(
      "useVendorListings must be used within a VendorListingsProvider",
    );
  }
  return context;
}
