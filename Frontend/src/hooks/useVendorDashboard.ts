import { useQuery } from "@tanstack/react-query";
import { getVendorDashboard } from "@/api/vendorDashboard";
import { AxiosError } from "axios";

interface UseVendorDashboardOptions {
  enabled?: boolean;
}

export const useVendorDashboard = (options?: UseVendorDashboardOptions) => {
  const getStatus = (error: unknown): number | undefined => {
    const axiosError = error as AxiosError;
    if (axiosError?.response?.status) return axiosError.response.status;

    if (typeof error === "object" && error !== null && "statusCode" in error) {
      const status = (error as { statusCode?: unknown }).statusCode;
      if (typeof status === "number") return status;
    }

    return undefined;
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["vendor-dashboard"],
    queryFn: getVendorDashboard,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      const status = getStatus(error);
      if (status === 404 || status === 500) return false;
      return failureCount < 1;
    },
    enabled: options?.enabled ?? true,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
