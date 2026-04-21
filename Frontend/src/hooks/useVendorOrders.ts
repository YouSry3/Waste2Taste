import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../services/api/apiClient";
import { authService } from "../services/auth/authService";
import type {
  Order,
  OrderItem,
  OrderStats,
  OrderStatus,
} from "../components/vendor/orders/types/orders.types";

interface RawVendorOrdersStats {
  totalRevenue?: unknown;
  readyForPickup?: unknown;
  pendingPickup?: unknown;
  pendingPickups?: unknown;
  averageOrderValue?: unknown;
  avgOrderValue?: unknown;
}

interface RawVendorOrdersResponse {
  orders?: unknown[];
  stats?: RawVendorOrdersStats;
}

export interface VendorOrdersDashboardData {
  orders: Order[];
  stats: OrderStats;
}

const QUERY_KEY_PREFIX = ["vendor-orders-dashboard"] as const;

const asObject = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};

const asArray = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
};

const toText = (value: unknown, fallback: string): string => {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return fallback;
};

const toCurrency = (value: unknown, fallback = 0): string => {
  const amount = toNumber(value, fallback);
  return `$${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const toDisplayDate = (value: unknown, fallback = ""): string => {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime()) && trimmed.includes("T")) {
    return parsed.toLocaleDateString();
  }

  return trimmed;
};

const toDisplayDateTime = (value: unknown, fallback = ""): string => {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime()) && trimmed.includes("T")) {
    return parsed.toLocaleString();
  }

  return trimmed;
};

const toDateKey = (value: unknown, fallback = ""): string => {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  const dateOnly = trimmed.split("T")[0];
  return dateOnly || fallback;
};

const normalizeOrderStatus = (value: unknown): OrderStatus => {
  const raw = String(value ?? "").toLowerCase();

  if (raw.includes("ready")) return "Ready for Pickup";
  if (raw.includes("pending")) return "Pending Pickup";
  if (raw.includes("progress") || raw.includes("processing")) {
    return "In Progress";
  }
  if (raw.includes("complete") || raw.includes("picked")) return "Completed";
  if (raw.includes("cancel")) return "Cancelled";

  return "Pending Pickup";
};

const mapOrderItem = (value: unknown, index: number): OrderItem => {
  const item = asObject(value);
  const name = toText(
    item.name ?? item.productName ?? item.title ?? item.label,
    `Item ${index + 1}`,
  );
  const priceValue = toNumber(
    item.priceValue ??
      item.unitPrice ??
      item.price ??
      item.amount ??
      item.total ??
      item.subtotal,
  );

  return {
    id: toText(item.id ?? item.itemId ?? item.productId, `${index + 1}`),
    name,
    quantity: Math.max(
      1,
      Math.floor(
        toNumber(item.quantity ?? item.qty ?? item.count ?? item.units, 1),
      ),
    ),
    price: toCurrency(item.price ?? item.unitPrice ?? item.amount ?? priceValue, priceValue),
    priceValue,
    sku: toText(item.sku, ""),
    category: toText(item.category, ""),
  };
};

const mapOrder = (value: unknown, index: number): Order => {
  const item = asObject(value);
  const rawItems = asArray(item.itemsList ?? item.items ?? item.products);
  const itemsList = rawItems.map(mapOrderItem).filter(Boolean);
  const orderNumber = toText(
    item.orderNumber ?? item.orderNo ?? item.referenceNumber ?? item.code ?? item.id ?? item.orderId,
    `ORD-${1000 + index}`,
  );
  const amountValue = toNumber(
    item.amountValue ??
      item.totalAmount ??
      item.total ??
      item.subtotal ??
      item.amount ??
      item.price,
  );
  const itemsText =
    itemsList.length > 0
      ? itemsList.map((entry) => entry.name).join(", ")
      : toText(item.items ?? item.productName ?? item.itemName, "Order Items");
  const quantity = itemsList.length
    ? itemsList.reduce((sum, entry) => sum + entry.quantity, 0)
    : Math.max(
        1,
        Math.floor(
          toNumber(item.quantity ?? item.totalQuantity ?? item.itemsCount, 1),
        ),
      );

  return {
    id: toText(item.id ?? item.orderId ?? orderNumber, `#${orderNumber}`),
    orderNumber,
    customerName: toText(
      item.customerName ??
        item.userName ??
        asObject(item.user).name ??
        asObject(item.customer).name,
      "Unknown Customer",
    ),
    vendorName: toText(
      item.vendorName ??
        item.storeName ??
        asObject(item.vendor).name ??
        item.businessName,
      "Unknown Vendor",
    ),
    items: itemsText,
    quantity,
    totalAmount: toCurrency(item.totalAmount ?? item.amount ?? item.total ?? amountValue, amountValue),
    amountValue,
    pickupTime: toText(
      item.pickupTime ??
        item.pickupWindow ??
        item.pickupSlot ??
        item.timeSlot ??
        item.time,
      "Pickup time unavailable",
    ),
    status: normalizeOrderStatus(item.status),
    orderDate: toDisplayDate(item.orderDate ?? item.date ?? item.createdAt, toText(item.orderDate ?? item.date ?? item.createdAt, "")),
    deliveryAddress: toText(
      item.deliveryAddress ??
        item.address ??
        item.pickupLocation ??
        item.location,
      "Address unavailable",
    ),
    paymentMethod: toText(
      item.paymentMethod ?? item.payment ?? item.paymentType,
      "N/A",
    ),
    notes: toText(item.notes ?? item.orderNotes ?? item.comment, ""),
    customerEmail: toText(
      item.customerEmail ??
        item.userEmail ??
        item.email ??
        asObject(item.customer).email,
      "N/A",
    ),
    customerPhone: toText(
      item.customerPhone ??
        item.userPhone ??
        item.phone ??
        asObject(item.customer).phone,
      "N/A",
    ),
    vendorEmail: toText(
      item.vendorEmail ?? item.storeEmail ?? asObject(item.vendor).email,
      "N/A",
    ),
    vendorPhone: toText(
      item.vendorPhone ?? item.storePhone ?? asObject(item.vendor).phone,
      "N/A",
    ),
    itemsList: itemsList.length > 0 ? itemsList : undefined,
    createdAt: toDisplayDateTime(
      item.createdAt ?? item.created_at ?? item.orderDate ?? item.date,
      toText(item.createdAt ?? item.created_at ?? item.orderDate ?? item.date, ""),
    ),
    updatedAt: toDisplayDateTime(item.updatedAt ?? item.updated_at, ""),
    pickedUpAt: toDisplayDateTime(item.pickedUpAt ?? item.picked_up_at ?? item.completedAt, ""),
  };
};

const getNumber = (
  source: Record<string, unknown>,
  key: string,
  fallback: number,
): number => {
  if (!Object.prototype.hasOwnProperty.call(source, key)) {
    return fallback;
  }

  const value = source[key];
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return toNumber(value, fallback);
};

const normalizeResponse = (
  payload: unknown,
): VendorOrdersDashboardData => {
  const raw = asObject(payload);
  const directData = asObject(raw.data);
  const nestedData = asObject(directData.data);

  const resolved = [raw, directData, nestedData].find((entry) =>
    Object.prototype.hasOwnProperty.call(entry, "orders") ||
    Object.prototype.hasOwnProperty.call(entry, "stats")
  ) ?? raw;

  const orders = asArray(resolved.orders).map(mapOrder);
  const statsSource = asObject(resolved.stats);
  const derivedRevenue = orders.reduce((sum, order) => sum + order.amountValue, 0);
  const derivedReady = orders.filter(
    (order) => order.status === "Ready for Pickup",
  ).length;
  const derivedPending = orders.filter(
    (order) => order.status === "Pending Pickup",
  ).length;
  const derivedCompletedToday = orders.filter(
    (order) =>
      order.status === "Completed" &&
      toDateKey(order.orderDate, "") === new Date().toISOString().split("T")[0],
  ).length;

  return {
    orders,
    stats: {
      totalRevenue: getNumber(statsSource, "totalRevenue", derivedRevenue),
      readyForPickup: getNumber(statsSource, "readyForPickup", derivedReady),
      pendingPickups: getNumber(
        statsSource,
        "pendingPickup",
        getNumber(statsSource, "pendingPickups", derivedPending),
      ),
      completedToday: derivedCompletedToday,
      avgOrderValue: getNumber(
        statsSource,
        "averageOrderValue",
        getNumber(statsSource, "avgOrderValue", orders.length ? derivedRevenue / orders.length : 0),
      ),
      totalOrders: orders.length,
    },
  };
};

const getErrorStatus = (error: unknown): number | undefined => {
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

const fetchVendorOrders = async (): Promise<VendorOrdersDashboardData> => {
  const response = await apiClient.get<unknown>("/dashboard/orders");
  // Diagnostics: log headers and a small preview of the response to help
  // identify parsing/content-type issues reported as SyntaxError in the browser.
  try {
    // eslint-disable-next-line no-console
    console.debug("[diagnostic] /dashboard/orders headers:", response.headers);
    // eslint-disable-next-line no-console
    console.debug(
      "[diagnostic] /dashboard/orders data (type):",
      typeof response.data,
    );
    // eslint-disable-next-line no-console
    console.debug(
      "[diagnostic] /dashboard/orders data (preview):",
      response.data && (response.data as any).stats ? (response.data as any).stats : response.data,
    );
  } catch (logErr) {
    // eslint-disable-next-line no-console
    console.warn("[diagnostic] Failed to log /dashboard/orders response:", logErr);
  }

  try {
    return normalizeResponse(response.data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[diagnostic] normalizeResponse failed:", err, "rawResponse:", response.data);
    throw err;
  }
};

export const useVendorOrdersDashboard = () => {
  const currentUser = authService.getCurrentUser();
  const authToken = localStorage.getItem("authToken") || "no-token";

  const queryKey = [
    ...QUERY_KEY_PREFIX,
    currentUser?.email || "anonymous",
    currentUser?.panelType || "unknown",
    authToken,
  ] as const;

  return useQuery({
    queryKey,
    queryFn: fetchVendorOrders,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      const status = getErrorStatus(error);
      if (status === 401 || status === 404) {
        return false;
      }
      return failureCount < 1;
    },
  });
};
