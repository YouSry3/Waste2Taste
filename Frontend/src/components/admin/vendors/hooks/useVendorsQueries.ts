import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api/apiClient";
import { MOCK_VENDORS } from "../constants/vendors.data";
import type { Vendor } from "../api/vendors.types";

export interface VendorsSummaryResponse {
  totalVendors: number | null;
  ngoPartners: number | null;
  activeListings: number | null;
  totalRevenue: number | null;
  topPerformers: Vendor[];
}

export type VendorsOverview = VendorsSummaryResponse;
export interface VendorsListResponse {
  items: Vendor[];
  totalCount: number;
}

type DataSource = "api" | "demo" | "fallback";

interface QueryPayload<T> {
  data: T;
  source: DataSource;
}

const QUERY_KEYS = {
  summary: ["admin-vendors-summary"] as const,
  list: (page: number, limit: number) =>
    ["admin-vendors-list", page, limit] as const,
};

const API_PREFIX = (import.meta.env.VITE_API_PREFIX as string | undefined) ?? "";

const normalizePrefix = (prefix: string): string => {
  const trimmed = prefix.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("/") ? trimmed.replace(/\/+$/, "") : `/${trimmed.replace(/\/+$/, "")}`;
};

const withPrefix = (path: string): string => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const prefix = normalizePrefix(API_PREFIX);
  return prefix ? `${prefix}${cleanPath}` : cleanPath;
};

const SUMMARY_ENDPOINT =
  (import.meta.env.VITE_ADMIN_VENDORS_SUMMARY_ENDPOINT as string | undefined) ??
  withPrefix("/Admin/Vendors-overview");

const LIST_ENDPOINT =
  (import.meta.env.VITE_ADMIN_VENDORS_LIST_ENDPOINT as string | undefined) ??
  withPrefix("/Admin/Vendors");

const isDemoMode = (): boolean => {
  const hasMockFlag = import.meta.env.VITE_ENABLE_MOCK_DATA === "true";
  const token = localStorage.getItem("authToken");
  const tokenIsDemo = !!token && token.startsWith("demo-token-");
  return hasMockFlag || tokenIsDemo;
};

const asObject = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};

const getStatusCode = (error: unknown): number | undefined => {
  if (!error || typeof error !== "object") return undefined;
  const obj = error as Record<string, unknown>;

  if (typeof obj.statusCode === "number") {
    return obj.statusCode;
  }

  const response = asObject(obj.response);
  return typeof response.status === "number"
    ? (response.status as number)
    : undefined;
};

const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toOptionalNumber = (
  value: unknown,
  hasField: boolean,
): number | null => {
  if (!hasField || value === null || value === undefined || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toMoneyString = (value: unknown): string =>
  `$${toNumber(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const parseVendorType = (value: unknown): Vendor["type"] => {
  const raw = String(value ?? "").toLowerCase();
  if (raw.includes("ngo")) return "NGO Partner";
  return "Vendor";
};

const parseVendorStatus = (value: unknown): Vendor["status"] => {
  const raw = String(value ?? "").toLowerCase();
  return raw === "inactive" ? "Inactive" : "Active";
};

const toVendorId = (value: unknown, fallback: number): number => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const mapApiVendorToVendor = (payload: unknown, index: number): Vendor => {
  const item = asObject(payload);

  return {
    id: toVendorId(item.id, index + 1),
    name: String(item.name ?? "Unknown Vendor"),
    type: parseVendorType(item.type),
    category: String(item.category ?? "General"),
    contact: String(item.contact ?? item.contactName ?? "N/A"),
    email: String(item.email ?? "N/A"),
    phone: String(item.phone ?? "N/A"),
    address: String(item.address ?? "N/A"),
    listings: toNumber(item.listings ?? item.activeListings),
    revenue: toMoneyString(item.revenue),
    rating: toNumber(item.rating, 5),
    status: parseVendorStatus(item.status),
  };
};

const fallbackSummary: VendorsSummaryResponse = {
  totalVendors: MOCK_VENDORS.filter((vendor) => vendor.type === "Vendor").length,
  ngoPartners: MOCK_VENDORS.filter((vendor) => vendor.type === "NGO Partner")
    .length,
  activeListings: MOCK_VENDORS.reduce(
    (sum, vendor) => sum + vendor.listings,
    0,
  ),
  totalRevenue: MOCK_VENDORS.reduce(
    (sum, vendor) => sum + Number(vendor.revenue.replace(/[$,]/g, "")),
    0,
  ),
  topPerformers: [...MOCK_VENDORS]
    .filter((vendor) => vendor.type === "Vendor")
    .sort(
      (a, b) =>
        Number(b.revenue.replace(/[$,]/g, "")) -
        Number(a.revenue.replace(/[$,]/g, "")),
    )
    .slice(0, 3),
};

const fallbackList = (page: number, limit: number): VendorsListResponse => {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const start = (safePage - 1) * safeLimit;
  const end = start + safeLimit;

  return {
    items: MOCK_VENDORS.slice(start, end),
    totalCount: MOCK_VENDORS.length,
  };
};

const normalizeSummaryPayload = (payload: unknown): VendorsSummaryResponse => {
  const raw = asObject(payload);
  const topPerformersPayload = Array.isArray(raw.topPerformers)
    ? raw.topPerformers
    : [];
  const hasTotalVendors = Object.prototype.hasOwnProperty.call(raw, "totalVendors");
  const hasNgoPartners = Object.prototype.hasOwnProperty.call(raw, "ngoPartners");
  const hasActiveListings = Object.prototype.hasOwnProperty.call(raw, "activeListings");
  const hasTotalRevenue = Object.prototype.hasOwnProperty.call(raw, "totalRevenue");

  return {
    totalVendors: toOptionalNumber(raw.totalVendors, hasTotalVendors),
    ngoPartners: toOptionalNumber(raw.ngoPartners, hasNgoPartners),
    activeListings: toOptionalNumber(raw.activeListings, hasActiveListings),
    totalRevenue: toOptionalNumber(raw.totalRevenue, hasTotalRevenue),
    topPerformers: topPerformersPayload.map(mapApiVendorToVendor),
  };
};

const normalizeListPayload = (payload: unknown): VendorsListResponse => {
  const raw = asObject(payload);
  const itemsPayload = Array.isArray(raw.items) ? raw.items : [];
  const items = itemsPayload.map(mapApiVendorToVendor);

  return {
    items,
    totalCount: toNumber(raw.totalCount, items.length),
  };
};

const fetchSummary = async (): Promise<VendorsSummaryResponse> => {
  const response = await apiClient.get(SUMMARY_ENDPOINT);
  return normalizeSummaryPayload(response.data);
};

const fetchList = async (
  page: number,
  limit: number,
): Promise<VendorsListResponse> => {
  const paramCandidates: Array<Record<string, number>> = [
    { page, limit },
    { pageNumber: page, pageSize: limit },
    { Page: page, Limit: limit },
  ];

  let lastError: unknown;

  for (const params of paramCandidates) {
    try {
      const response = await apiClient.get(LIST_ENDPOINT, {
        params,
        headers: {
          // Some ASP.NET endpoints reject GET requests that include JSON content type.
          "Content-Type": undefined,
          Accept: "application/json",
        },
      });
      return normalizeListPayload(response.data);
    } catch (error) {
      lastError = error;

      const status = getStatusCode(error);
      if (status === 415) {
        continue;
      }
      throw error;
    }
  }

  // Some backends expose the same list endpoint as POST with pagination body.
  try {
    const response = await apiClient.post(
      LIST_ENDPOINT,
      { page, limit, pageNumber: page, pageSize: limit },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );
    return normalizeListPayload(response.data);
  } catch (error) {
    lastError = error;
  }

  throw lastError ?? new Error("Failed to fetch vendors list");
};

export const useVendorsOverview = () => {
  const queryClient = useQueryClient();
  const demoMode = isDemoMode();
  const queryKey = QUERY_KEYS.summary;

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<QueryPayload<VendorsSummaryResponse>> => {
      const cached =
        queryClient.getQueryData<QueryPayload<VendorsSummaryResponse>>(
          queryKey,
        );
      if (cached) {
        return cached;
      }

      if (demoMode) {
        return { data: fallbackSummary, source: "demo" };
      }

      try {
        const summary = await fetchSummary();
        return { data: summary, source: "api" };
      } catch (error) {
        if (getStatusCode(error) !== 404) {
          console.warn("Failed to fetch vendors summary. Using demo fallback.", error);
        }
        return { data: fallbackSummary, source: "fallback" };
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    ...query,
    data: query.data?.data ?? fallbackSummary,
    source: query.data?.source ?? "demo",
  };
};

export const useVendorsSummary = useVendorsOverview;

export const useVendorsList = (page = 1, limit = 10) => {
  const queryClient = useQueryClient();
  const demoMode = isDemoMode();
  const queryKey = QUERY_KEYS.list(page, limit);

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<QueryPayload<VendorsListResponse>> => {
      const cached =
        queryClient.getQueryData<QueryPayload<VendorsListResponse>>(queryKey);
      if (cached) {
        return cached;
      }

      if (demoMode) {
        return { data: fallbackList(page, limit), source: "demo" };
      }

      try {
        const list = await fetchList(page, limit);
        return { data: list, source: "api" };
      } catch (error) {
        if (getStatusCode(error) !== 404) {
          console.warn("Failed to fetch vendors list. Using demo fallback.", error);
        }
        return { data: fallbackList(page, limit), source: "fallback" };
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    ...query,
    data: query.data?.data ?? fallbackList(page, limit),
    source: query.data?.source ?? "demo",
  };
};
