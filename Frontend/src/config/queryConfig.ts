/**
 * Centralized React Query configuration
 * This provides consistent settings for all API queries
 */

export const QUERY_CONFIG = {
  // Refetch interval - how often to poll the API (in milliseconds)
  REFETCH_INTERVAL: 1000, // 2 seconds
  
  // Stale time - how long data is considered fresh (in milliseconds)
  // Set to 0 for immediate refetch, or increase for less frequent updates
  STALE_TIME: 0,
  
  // Cache time - how long to keep data in cache (in milliseconds)
  GC_TIME: 5 * 60 * 1000, // 5 minutes
  
  // Default retry attempts
  RETRY_ATTEMPTS: 2,
  
  // Whether to refetch when window regains focus
  REFETCH_ON_WINDOW_FOCUS: true,
  
  // Whether to refetch when component mounts
  REFETCH_ON_MOUNT: 'always' as const,
} as const;

/**
 * Default options for all queries
 */
export const DEFAULT_QUERY_OPTIONS = {
  staleTime: QUERY_CONFIG.STALE_TIME,
  gcTime: QUERY_CONFIG.GC_TIME,
  refetchInterval: QUERY_CONFIG.REFETCH_INTERVAL,
  refetchOnWindowFocus: QUERY_CONFIG.REFETCH_ON_WINDOW_FOCUS,
  refetchOnMount: QUERY_CONFIG.REFETCH_ON_MOUNT,
  retry: QUERY_CONFIG.RETRY_ATTEMPTS,
} as const;

export type QueryConfigType = typeof QUERY_CONFIG;
