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
  getVendorListings: async (): Promise<ListingsResponse> => {
    const vendorId = localStorage.getItem("vendorId");
    const res = await vendorApiClient.get(`/products/vendor/${vendorId}/all`);
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

  createListing: async (dto: CreateListingDto) => {
    try{
      const formData = new FormData();
    formData.append("VendorId", dto.VendorId);
    formData.append("Name", dto.Name);
    formData.append("Description", dto.Description);
    formData.append("Category", dto.Category);
    formData.append("Price", String(dto.Price));
    formData.append("OriginalPrice", String(dto.OriginalPrice));
    formData.append("Quantity", String(dto.Quantity));
    formData.append("ExpiryDate", dto.ExpiryDate);
    if (dto.ImageFile) formData.append("ImageFile", dto.ImageFile);

    const res = await vendorApiClient.post("/products",  formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
    }
    catch (err: any) {
    // This logs the actual server validation errors
    console.error("Server error detail:", err.response?.data);
    throw err;
  }
  },

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

  deleteListing: async (id: string | number) => {
    const res = await vendorApiClient.delete(`/products/${id}`);
    return res.data;
  },

  // FIX: quantity sent as QUERY parameter ([FromQuery])
  updateStock: async (id: string | number, quantity: number) => {
    const res = await vendorApiClient.patch(`/products/${id}/stock`, null, {
      params: { quantity },
    });
    return res.data;
  },

  // REMOVED: markAsExpired — expiry is now automatic based on date

  getPendingListings: async () => {
    const res = await vendorApiClient.get("/Listing/pending");
    const raw = res.data;
    const items =
      raw.listings ?? raw.items ?? raw.data ?? raw.value ??
      (Array.isArray(raw) ? raw : []);
    return items.map(mapListing);
  },

  approveListing: async (productId: string | number) => {
    const res = await vendorApiClient.post("/Listing/approve", { productId });
    return res.data;
  },

  rejectListing: async (productId: string | number, reason?: string) => {
    const res = await vendorApiClient.post("/Listing/reject", { productId, reason });
    return res.data;
  },
};