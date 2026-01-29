/**
 * ORDERS TANSTACK QUERY HOOKS - MOCK DATA VERSION
 *
 * READY FOR API INTEGRATION WHEN YOU'RE READY
 *
 * INSTRUCTIONS FOR AI DEVELOPER:
 *
 * 1. CURRENTLY USING MOCK DATA - Replace queryFn with actual API calls
 * 2. Configure QueryClientProvider in your app root
 * 3. Adjust staleTime and cacheTime based on your needs
 * 4. Add proper error handling when connecting to real API
 */

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
  QueryKey,
} from "@tanstack/react-query";
import { ordersApi } from "./orders.api";
import {
  Order,
  OrderFilters,
  OrderStats,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  initialOrders, // Using mock data
} from "../types/orders.types";

// Query keys for cache management
export const orderQueryKeys = {
  all: ["orders"] as const,
  lists: () => [...orderQueryKeys.all, "list"] as const,
  list: (filters: OrderFilters) =>
    [...orderQueryKeys.lists(), { filters }] as const,
  details: () => [...orderQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...orderQueryKeys.details(), id] as const,
  stats: (filters?: OrderFilters) =>
    [...orderQueryKeys.all, "stats", { filters }] as const,
  vendors: () => [...orderQueryKeys.all, "vendors"] as const,
};

/**
 * MOCK HELPER: Filter orders based on filters (for mock data only)
 * TODO: Replace with actual API filtering when backend is ready
 */
const mockFilterOrders = (orders: Order[], filters: OrderFilters): Order[] => {
  let filtered = [...orders];

  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((order) => order.status === filters.status);
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchTerm) ||
        order.customerName.toLowerCase().includes(searchTerm) ||
        order.vendorName.toLowerCase().includes(searchTerm) ||
        order.items.toLowerCase().includes(searchTerm),
    );
  }

  if (filters.minAmount !== undefined) {
    filtered = filtered.filter(
      (order) => order.amountValue >= filters.minAmount!,
    );
  }

  if (filters.maxAmount !== undefined) {
    filtered = filtered.filter(
      (order) => order.amountValue <= filters.maxAmount!,
    );
  }

  if (filters.startDate) {
    filtered = filtered.filter(
      (order) => new Date(order.orderDate) >= new Date(filters.startDate!),
    );
  }

  if (filters.endDate) {
    filtered = filtered.filter(
      (order) => new Date(order.orderDate) <= new Date(filters.endDate!),
    );
  }

  return filtered;
};

/**
 * MOCK HELPER: Calculate stats from orders (for mock data only)
 * TODO: Replace with actual API call when backend is ready
 */
const mockCalculateStats = (
  orders: Order[],
  filters?: OrderFilters,
): OrderStats => {
  const filteredOrders = filters ? mockFilterOrders(orders, filters) : orders;

  const totalRevenue = filteredOrders.reduce((sum, order) => {
    if (order.status !== "Cancelled") return sum + order.amountValue;
    return sum;
  }, 0);

  const readyForPickup = filteredOrders.filter(
    (o) => o.status === "Ready for Pickup",
  ).length;

  const pendingPickups = filteredOrders.filter(
    (o) => o.status === "Pending Pickup",
  ).length;

  const completedToday = filteredOrders.filter(
    (o) =>
      o.status === "Completed" &&
      o.orderDate === new Date().toISOString().split("T")[0],
  ).length;

  const avgOrderValue = totalRevenue / filteredOrders.length;

  return {
    totalRevenue,
    readyForPickup,
    pendingPickups,
    completedToday,
    avgOrderValue,
    totalOrders: filteredOrders.length,
  };
};

/**
 * MOCK HELPER: Paginate orders (for mock data only)
 * TODO: Replace with actual API pagination when backend is ready
 */
const mockPaginateOrders = (
  orders: Order[],
  page: number,
  limit: number,
): PaginatedResponse<Order> => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  return {
    data: paginatedOrders,
    pagination: {
      page,
      limit,
      total: orders.length,
      totalPages: Math.ceil(orders.length / limit),
      hasNext: endIndex < orders.length,
      hasPrev: page > 1,
    },
  };
};

/**
 * HOOK: Fetch orders with pagination (MOCK VERSION)
 *
 * TODO FOR API INTEGRATION:
 * 1. Replace queryFn with: () => ordersApi.getOrders(filters, pagination)
 * 2. Remove mockFilterOrders and mockPaginateOrders functions
 * 3. Adjust staleTime based on your API update frequency
 */
export const useOrders = (
  filters: OrderFilters = {},
  pagination: PaginationParams = { page: 1, limit: 10 },
  options?: UseQueryOptions<ApiResponse<PaginatedResponse<Order>>, Error>,
) => {
  return useQuery<ApiResponse<PaginatedResponse<Order>>, Error>({
    queryKey: orderQueryKeys.list(filters),
    queryFn: async () => {
      // MOCK DATA - REPLACE WITH API CALL
      console.log(
        "📡 [MOCK] Fetching orders with filters:",
        filters,
        "pagination:",
        pagination,
      );

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const filteredOrders = mockFilterOrders(initialOrders, filters);
      const paginatedData = mockPaginateOrders(
        filteredOrders,
        pagination.page || 1,
        pagination.limit || 10,
      );

      return {
        success: true,
        data: paginatedData,
        message: "Orders fetched successfully",
        timestamp: new Date().toISOString(),
      };
    },
    // TODO: Adjust these times when connected to real API
    staleTime: 0, // Data is immediately stale for mock
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    retry: false, // No retry for mock
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * HOOK: Fetch single order details (MOCK VERSION)
 *
 * TODO FOR API INTEGRATION:
 * 1. Replace queryFn with: () => ordersApi.getOrderById(orderId)
 * 2. Remove the find logic
 */
export const useOrder = (
  orderId: string,
  options?: UseQueryOptions<ApiResponse<Order>, Error>,
) => {
  return useQuery<ApiResponse<Order>, Error>({
    queryKey: orderQueryKeys.detail(orderId),
    queryFn: async () => {
      // MOCK DATA - REPLACE WITH API CALL
      console.log("📡 [MOCK] Fetching order:", orderId);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 200));

      const order = initialOrders.find((o) => o.id === orderId);

      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }

      return {
        success: true,
        data: order,
        message: "Order fetched successfully",
        timestamp: new Date().toISOString(),
      };
    },
    enabled: !!orderId,
    staleTime: 0,
    ...options,
  });
};

/**
 * HOOK: Fetch orders statistics (MOCK VERSION)
 *
 * TODO FOR API INTEGRATION:
 * 1. Replace queryFn with: () => ordersApi.getOrderStats(filters)
 * 2. Remove mockCalculateStats function
 */
export const useOrderStats = (
  filters?: OrderFilters,
  options?: UseQueryOptions<ApiResponse<OrderStats>, Error>,
) => {
  return useQuery<ApiResponse<OrderStats>, Error>({
    queryKey: orderQueryKeys.stats(filters),
    queryFn: async () => {
      // MOCK DATA - REPLACE WITH API CALL
      console.log("📡 [MOCK] Fetching order stats with filters:", filters);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 250));

      const stats = mockCalculateStats(initialOrders, filters);

      return {
        success: true,
        data: stats,
        message: "Statistics fetched successfully",
        timestamp: new Date().toISOString(),
      };
    },
    staleTime: 0,
    refetchInterval: false, // Disable auto-refresh for mock
    ...options,
  });
};

/**
 * HOOK: Fetch vendors list (MOCK VERSION)
 *
 * TODO FOR API INTEGRATION:
 * 1. Replace queryFn with: () => ordersApi.getVendors()
 * 2. Add proper vendor type from your API
 */
export const useVendors = (
  options?: UseQueryOptions<
    ApiResponse<Array<{ id: string; name: string }>>,
    Error
  >,
) => {
  return useQuery<ApiResponse<Array<{ id: string; name: string }>>, Error>({
    queryKey: orderQueryKeys.vendors(),
    queryFn: async () => {
      // MOCK DATA - REPLACE WITH API CALL
      console.log("📡 [MOCK] Fetching vendors");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Extract unique vendors from mock data
      const vendorMap = new Map<string, string>();
      initialOrders.forEach((order) => {
        if (!vendorMap.has(order.vendorName)) {
          vendorMap.set(order.vendorName, order.vendorName);
        }
      });

      const vendors = Array.from(vendorMap.entries()).map(([name]) => ({
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
      }));

      return {
        success: true,
        data: vendors,
        message: "Vendors fetched successfully",
        timestamp: new Date().toISOString(),
      };
    },
    staleTime: 0,
    ...options,
  });
};

/**
 * HOOK: Infinite scroll for orders (MOCK VERSION)
 *
 * TODO FOR API INTEGRATION:
 * 1. Replace queryFn with actual infinite scroll API
 * 2. Implement proper cursor/offset pagination
 */
export const useInfiniteOrders = (
  filters: OrderFilters = {},
  pageSize: number = 10,
  options?: Partial<
    UseInfiniteQueryOptions<
      ApiResponse<PaginatedResponse<Order>>,
      Error,
      InfiniteData<ApiResponse<PaginatedResponse<Order>>>,
      QueryKey,
      number
    >
  >,
) => {
  return useInfiniteQuery<
    ApiResponse<PaginatedResponse<Order>>,
    Error,
    InfiniteData<ApiResponse<PaginatedResponse<Order>>>,
    QueryKey,
    number
  >({
    queryKey: [...orderQueryKeys.list(filters), "infinite"],
    queryFn: async ({ pageParam = 1 }) => {
      // MOCK DATA - REPLACE WITH API CALL
      console.log(
        "📡 [MOCK] Infinite query page:",
        pageParam,
        "filters:",
        filters,
      );

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const filteredOrders = mockFilterOrders(initialOrders, filters);
      const paginatedData = mockPaginateOrders(
        filteredOrders,
        pageParam,
        pageSize,
      );

      return {
        success: true,
        data: paginatedData,
        message: "Orders fetched successfully",
        timestamp: new Date().toISOString(),
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data?.pagination) return undefined;
      const { pagination } = lastPage.data;
      return pagination.hasNext ? pagination.page + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      if (!firstPage?.data?.pagination) return undefined;
      const { pagination } = firstPage.data;
      return pagination.hasPrev ? pagination.page - 1 : undefined;
    },
    initialPageParam: 1,
    ...options,
  });
};

/**
 * UTILITY: Setup instructions for React Query
 */
export const setupReactQueryInstructions = `
📋 REACT QUERY SETUP INSTRUCTIONS:

1. INSTALLATION:
   npm install @tanstack/react-query
   npm install @tanstack/react-query-devtools

2. APP PROVIDER SETUP (in _app.tsx or App.tsx):
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
   import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

   const queryClient = new QueryClient({
     defaultOptions: {
       queries: {
         staleTime: 5 * 60 * 1000, // 5 minutes
         gcTime: 10 * 60 * 1000, // 10 minutes
         retry: 2,
       },
     },
   });

   function App() {
     return (
       <QueryClientProvider client={queryClient}>
         <YourApp />
         <ReactQueryDevtools initialIsOpen={false} />
       </QueryClientProvider>
     );
   }

3. READY FOR API INTEGRATION:
   - Replace all mock queryFn with actual API calls
   - Implement mutations with useMutation
   - Add proper error boundaries
   - Configure optimistic updates
`;
