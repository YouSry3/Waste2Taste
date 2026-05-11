// // import axios from "axios";
// // import { API_CONFIG, API_ENDPOINTS } from "../constants/api.config";
// // import {
// //   Listing,
// //   CreateListingDto,
// //   UpdateListingDto,
// // } from "../types/listing.types";

// // const apiClient = axios.create({
// //   baseURL: API_CONFIG.baseURL,
// //   timeout: API_CONFIG.timeout,
// //   headers: API_CONFIG.headers,
// // });

// // // Backend response shape
// // export type ListingsResponse = {
// //   activeCount: number;
// //   listings: Listing[];
// // };

// // export const listingApi = {
// //   getAllListings: async (params?: {
// //     page?: number;
// //     limit?: number;
// //     sortBy?: string;
// //     sortOrder?: "asc" | "desc";
// //   }) => {
// //     const res = await apiClient.get<ListingsResponse>(
// //       API_ENDPOINTS.LISTINGS.BASE,
// //       { params },
// //     );

// //     return res.data;
// //   },

// //   getListingById: async (id: number | string) => {
// //     const res = await apiClient.get<Listing>(API_ENDPOINTS.LISTINGS.BY_ID(id));
// //     return res.data;
// //   },

// //   createListing: async (data: CreateListingDto) => {
// //     const res = await apiClient.post<{ message: string; data: Listing }>(
// //       API_ENDPOINTS.LISTINGS.BASE,
// //       data,
// //     );
// //     return res.data;
// //   },

// //   updateListing: async (id: number | string, data: UpdateListingDto) => {
// //     const res = await apiClient.put<{ message: string; data: Listing }>(
// //       API_ENDPOINTS.LISTINGS.BY_ID(id),
// //       data,
// //     );
// //     return res.data;
// //   },

// //   deleteListing: async (id: number | string) => {
// //     const res = await apiClient.delete<{ message: string }>(
// //       API_ENDPOINTS.LISTINGS.BY_ID(id),
// //     );
// //     return res.data;
// //   },

// //   getFilteredListings: async (filters: any) => {
// //     const res = await apiClient.get<ListingsResponse>(
// //       API_ENDPOINTS.LISTINGS.FILTER,
// //       { params: filters },
// //     );
// //     return res.data;
// //   },

// //   searchListings: async (searchTerm: string) => {
// //     const res = await apiClient.get<Listing[]>(API_ENDPOINTS.LISTINGS.SEARCH, {
// //       params: { q: searchTerm },
// //     });
// //     return res.data;
// //   },

// //   getCategories: async () => {
// //     const res = await apiClient.get<string[]>(API_ENDPOINTS.CATEGORIES);
// //     return res.data;
// //   },

// //   getListingStats: async () => {
// //     const res = await apiClient.get<any>(API_ENDPOINTS.LISTINGS.STATS);
// //     return res.data;
// //   },
// // };


// //src\components\vendor\listings\constants


// import axios from "axios";
// import { API_CONFIG, API_ENDPOINTS } from "../../../../../src/components/vendor/listings/constants/api.config";

// const apiClient = axios.create({
//   baseURL: API_CONFIG.baseURL,
//   timeout: API_CONFIG.timeout,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // 🔴 ADD THIS: Inject Bearer token into every request
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Map backend fields → frontend expected fields
// const mapListing = (item: any) => ({
//   id: item.id || "",
//   title: item.name || item.title || "Untitled",
//   vendor: item.vendorName || item.vendor || "Unknown",
//   category: item.category || "Uncategorized",
  
//   // ListingCard expects photos as array
//   photos: item.imageUrl 
//     ? [`${API_CONFIG.baseURL}${item.imageUrl}`] 
//     : [],
  
//   // Numbers with fallbacks
//   originalPrice: Number(item.originalPrice ?? 0),
//   salePrice: Number(item.salePrice ?? item.price ?? 0),
//   discountPercentage: Number(item.discountPercentage ?? 0),
//   quantity: Number(item.quantity ?? 0),
//   rating: Number(item.rating ?? 0),
  
//   pickupTime: item.pickupTime || "Not specified",
//   location: item.location || "",
//   status: item.status || "Active",
//   description: item.description || "",
//   expiresIn: item.expiryDate 
//     ? new Date(item.expiryDate).toLocaleDateString() 
//     : "N/A",
// });

// export type ListingsResponse = {
//   activeCount: number;
//   listings: any[];
// };

// export const listingApi = {
//   getAllListings: async (params?: any) => {
//     const res = await apiClient.get(API_ENDPOINTS.LISTINGS.BASE, { params });
//     const response = res.data;

//     // Handle both wrapped and unwrapped responses
//     const rawListings = response.listings || response.items || response.data || [];
//     const activeCount = response.activeCount ?? rawListings.filter((l: any) => l.status === "Active").length;

//     return {
//       activeCount,
//       listings: rawListings.map(mapListing),
//     } as ListingsResponse;
//   },

//   getListingById: async (id: string) => {
//     const res = await apiClient.get(API_ENDPOINTS.LISTINGS.BY_ID(id));
//     return mapListing(res.data);
//   },

//   createListing: async (data: any) => {
//     const formData = new FormData();
//     Object.entries(data).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         formData.append(key, value instanceof File ? value : String(value));
//       }
//     });
//     const res = await apiClient.post(API_ENDPOINTS.LISTINGS.BASE, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return res.data;
//   },

//   updateListing: async (id: string, data: any) => {
//     const formData = new FormData();
//     Object.entries(data).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         formData.append(key, value instanceof File ? value : String(value));
//       }
//     });
//     const res = await apiClient.put(API_ENDPOINTS.LISTINGS.BY_ID(id), formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return res.data;
//   },

//   deleteListing: async (id: string) => {
//     const res = await apiClient.delete(API_ENDPOINTS.LISTINGS.BY_ID(id));
//     return res.data;
//   },

//   getFilteredListings: async (filters: any) => {
//     return listingApi.getAllListings(filters);
//   },

//   searchListings: async (searchTerm: string) => {
//     return listingApi.getAllListings({ search: searchTerm });
//   },

//   getCategories: async () => {
//     return ["Bakery", "Restaurant", "Cafe", "Grocery", "Other"];
//   },

//   getListingStats: async () => {
//     const res = await apiClient.get(API_ENDPOINTS.LISTINGS.STATS);
//     return res.data;
//   },
// };


// import axios from "axios";
// import { CreateListingDto } from "../types/listing.types";
// import { vendorApiClient } from "../../../../services/vendor/vendorDashboardApi";
// const apiClient = axios.create({
//   baseURL: "https://localhost:5000",
//   timeout: 10000,
// });

// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("authToken");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// const mapListing = (item: any) => ({
//   id: item.id ?? item.productId ?? "",
//   vendorId: item.vendorId ?? "",
//   vendor: item.vendorName ?? item.vendor ?? "Unknown",
//   title: item.name ?? item.title ?? "Untitled",
//   category: item.category ?? "Uncategorized",
//   photos: item.imageUrl
//     ? [`https://localhost:5000${item.imageUrl}`]
//     : item.photos ?? [],
//   originalPrice: Number(item.originalPrice ?? 0),
//   salePrice: Number(item.price ?? item.salePrice ?? 0),
//   price: Number(item.price ?? item.salePrice ?? 0),
//   quantity: Number(item.quantity ?? 0),
//   rating: Number(item.rating ?? 0),
//   pickupTime: item.pickupTime ?? "Not specified",
//   location: item.location ?? item.address ?? "",
//   status: item.status ?? "Pending",
//   description: item.description ?? "",
//   expiryDate: item.expiryDate ?? "",
// });

// export const listingApi = {
//   // Vendor: get their own listings
//   getVendorListings: async () => {
//     const res = await apiClient.get("/api/dashboard/listings");
//     const raw = res.data;
//     const items =
//       raw.listings ?? raw.items ?? raw.data ?? raw.value ??
//       (Array.isArray(raw) ? raw : []);
//     return {
//       listings: items.map(mapListing),
//       activeCount: raw.activeCount ?? items.filter((l: any) => l.status === "Active" || l.status === "Approved").length,
//     };
//   },

//   // Vendor: create a new listing (sent to admin as Pending)
//   createListing: async (dto: CreateListingDto) => {
//     const formData = new FormData();
//     formData.append("VendorId", dto.VendorId);
//     formData.append("Name", dto.Name);
//     formData.append("Description", dto.Description);
//     formData.append("Price", String(dto.Price));
//     formData.append("OriginalPrice", String(dto.OriginalPrice));
//     formData.append("Quantity", String(dto.Quantity));
//     formData.append("ExpiryDate", dto.ExpiryDate);
//     if (dto.ImageFile) formData.append("ImageFile", dto.ImageFile);

//     const res = await apiClient.post("/products", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return res.data;
//   },

//   // Vendor: update a listing
//   updateListing: async (id: string | number, dto: Partial<CreateListingDto> & { ImageFile?: File }) => {
//     const formData = new FormData();
//     if (dto.Name) formData.append("Name", dto.Name);
//     if (dto.Description) formData.append("Description", dto.Description);
//     if (dto.Price !== undefined) formData.append("Price", String(dto.Price));
//     if (dto.OriginalPrice !== undefined) formData.append("OriginalPrice", String(dto.OriginalPrice));
//     if (dto.Quantity !== undefined) formData.append("Quantity", String(dto.Quantity));
//     if (dto.ExpiryDate) formData.append("ExpiryDate", dto.ExpiryDate);
//     if (dto.ImageFile) formData.append("ImageFile", dto.ImageFile);

//     const res = await apiClient.put(`/products/${id}`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return res.data;
//   },

//   // Vendor: delete a listing
//   deleteListing: async (id: string | number) => {
//     const res = await apiClient.delete(`/products/${id}`);
//     return res.data;
//   },

//   // Admin: get pending listings
//   getPendingListings: async () => {
//     const res = await apiClient.get("/Listing/pending");
//     const raw = res.data;
//     const items =
//       raw.listings ?? raw.items ?? raw.data ?? raw.value ??
//       (Array.isArray(raw) ? raw : []);
//     return items.map(mapListing);
//   },

//   // Admin: approve a listing
//   approveListing: async (productId: string | number) => {
//     const res = await apiClient.post("/Listing/approve", { productId });
//     return res.data;
//   },

//   // Admin: reject a listing
//   rejectListing: async (productId: string | number, reason?: string) => {
//     const res = await apiClient.post("/Listing/reject", { productId, reason });
//     return res.data;
//   },
// };


// src/components/vendor/listings/api/listing.api.ts

import { vendorApiClient } from "../../../../services/vendor/vendorDashboardApi";
import { CreateListingDto } from "../types/listing.types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:5000";

const mapListing = (item: any) => ({
  id: item.id ?? item.productId ?? "",
  vendorId: item.vendorId ?? "",
  vendor: item.vendorName ?? item.vendor ?? "Unknown",
  title: item.name ?? item.title ?? "Untitled",
  category: item.category ?? "Uncategorized",
  photos: item.imageUrl
    ? [`${BASE_URL}${item.imageUrl}`]
    : item.photos ?? [],
  originalPrice: Number(item.originalPrice ?? 0),
  salePrice: Number(item.price ?? item.salePrice ?? 0),
  price: Number(item.price ?? item.salePrice ?? 0),
  discountPercentage: Number(item.discountPercentage ?? 0),
  quantity: Number(item.quantity ?? 0),
  rating: Number(item.rating ?? 0),
  pickupTime: item.pickupTime ?? "Not specified",
  location: item.location ?? item.address ?? "",
  status: item.status ?? "Pending",
  description: item.description ?? "",
  expiryDate: item.expiryDate ?? "",
});

export type ListingsResponse = {
  activeCount: number;
  listings: any[];
};

export const listingApi = {
  // Vendor: get their own listings
  getVendorListings: async (): Promise<ListingsResponse> => {
    const res = await vendorApiClient.get("/api/dashboard/listings");
    const raw = res.data;
    const items =
      raw.listings ?? raw.items ?? raw.data ?? raw.value ??
      (Array.isArray(raw) ? raw : []);
    return {
      listings: items.map(mapListing),
      activeCount:
        raw.activeCount ??
        items.filter((l: any) => l.status === "Active" || l.status === "Approved").length,
    };
  },

  // Vendor: create a new listing (goes to admin as Pending)
 createListing: async (dto: CreateListingDto) => {
  const formData = new FormData();
  formData.append("VendorId", dto.VendorId);
  formData.append("Name", dto.Name);
  formData.append("Description", dto.Description);
  formData.append("Category", dto.Category); // ← ADD THIS
  formData.append("Price", String(dto.Price));
  formData.append("OriginalPrice", String(dto.OriginalPrice));
  formData.append("Quantity", String(dto.Quantity));
  formData.append("ExpiryDate", dto.ExpiryDate);
  if (dto.ImageFile) formData.append("ImageFile", dto.ImageFile);

  const res = await vendorApiClient.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
},

  // Vendor: update a listing
  updateListing: async (
    id: string | number,
    dto: Partial<CreateListingDto> & { ImageFile?: File }
  ) => {
    const formData = new FormData();
    if (dto.Name) formData.append("Name", dto.Name);
    if (dto.Description) formData.append("Description", dto.Description);
    if (dto.Price !== undefined) formData.append("Price", String(dto.Price));
    if (dto.OriginalPrice !== undefined)
      formData.append("OriginalPrice", String(dto.OriginalPrice));
    if (dto.Quantity !== undefined)
      formData.append("Quantity", String(dto.Quantity));
    if (dto.ExpiryDate) formData.append("ExpiryDate", dto.ExpiryDate);
    if (dto.ImageFile) formData.append("ImageFile", dto.ImageFile);

    const res = await vendorApiClient.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Vendor: delete a listing
  deleteListing: async (id: string | number) => {
    const res = await vendorApiClient.delete(`/products/${id}`);
    return res.data;
  },

  // Admin: get pending listings
  getPendingListings: async () => {
    const res = await vendorApiClient.get("/Listing/pending");
    const raw = res.data;
    const items =
      raw.listings ?? raw.items ?? raw.data ?? raw.value ??
      (Array.isArray(raw) ? raw : []);
    return items.map(mapListing);
  },

  // Admin: approve a listing
  approveListing: async (productId: string | number) => {
    const res = await vendorApiClient.post("/Listing/approve", { productId });
    return res.data;
  },

  // Admin: reject a listing
  rejectListing: async (productId: string | number, reason?: string) => {
    const res = await vendorApiClient.post("/Listing/reject", { productId, reason });
    return res.data;
  },
};