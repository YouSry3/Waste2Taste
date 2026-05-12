
# Automatic API Refetching Configuration

## Overview
All your APIs now automatically refetch data every **2 seconds** to keep your UI always up-to-date. This is configured through React Query's global defaults and individual hook settings.

## How It Works

### 1. Global Configuration
The configuration is centralized in [src/config/queryConfig.ts](src/config/queryConfig.ts):
- **REFETCH_INTERVAL**: 2000ms (2 seconds) - All queries will refetch at this interval
- **STALE_TIME**: 0ms - Data is immediately considered stale
- **REFETCH_ON_WINDOW_FOCUS**: true - Refetches when user returns to the window
- **REFETCH_ON_MOUNT**: 'always' - Refetches when component mounts
- **GC_TIME**: 5 minutes - How long to cache data

### 2. Global Setup
In [src/main.tsx](src/main.tsx), these defaults are applied to all React Query queries:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: DEFAULT_QUERY_OPTIONS,
  },
});
```

### 3. Updated Hooks
All data-fetching hooks now use the centralized configuration:
- `useVendorDashboard()` - Vendor dashboard overview
- `useVendorAnalytics()` - Vendor analytics & trends
- `useVendorOrdersDashboard()` - Orders & order stats
- `useAdminDashboard()` - Admin dashboard overview

## Customization

### Change Global Refetch Interval
Edit [src/config/queryConfig.ts](src/config/queryConfig.ts):
```typescript
export const QUERY_CONFIG = {
  REFETCH_INTERVAL: 5000, // Change to 5 seconds
  // ... other settings
} as const;
```

### Override for Specific Queries
If a component needs different settings, override in the hook call:
```typescript
// This specific instance will refetch every 5 seconds instead of 2
const { data } = useVendorDashboard({
  refetchInterval: 5000
});
```

### Disable Refetching for a Query
```typescript
const { data } = useVendorAnalytics({
  refetchInterval: false // Disables automatic refetching
});
```

## Performance Considerations

### Every 2 Seconds (Current)
- ✅ UI always shows latest data
- ✅ Real-time feel for dashboard
- ⚠️ More frequent API calls (may impact backend)
- ⚠️ Higher network traffic

### Optimization Options
If performance is a concern, you can:

1. **Increase the interval** (e.g., 5-10 seconds):
   ```typescript
   REFETCH_INTERVAL: 10000 // 10 seconds
   ```

2. **Use staleTime** to reduce unnecessary refetches:
   ```typescript
   STALE_TIME: 3000 // Keep data fresh for 3 seconds
   REFETCH_INTERVAL: 10000 // Only refetch after 10 seconds
   ```

3. **Disable refetchOnWindowFocus** for less frequent updates:
   ```typescript
   REFETCH_ON_WINDOW_FOCUS: false
   ```

4. **Use selective queries** - Only enable refetching for critical data:
   ```typescript
   const { data } = useVendorOrders({
     refetchInterval: 2000, // Every 2 seconds
   });
   
   const { data: analytics } = useVendorAnalytics({
     refetchInterval: 10000, // Every 10 seconds
   });
   ```

## Backend Considerations
With automatic refetching every 2 seconds:
- Each connected user may generate ~30 API calls/minute
- For 10 concurrent users = ~300 API calls/minute
- Consider implementing:
  - API caching headers (Cache-Control, ETag)
  - Database query optimization
  - Rate limiting based on IP/user
  - WebSocket connections for true real-time updates (more efficient)

## Debugging
Use React Query DevTools to monitor queries:
- See which queries are refetching
- Check query status and cache timing
- Monitor network requests
- Access the DevTools in the bottom-right corner during development

## Related Files
- [src/config/queryConfig.ts](src/config/queryConfig.ts) - Query configuration
- [src/main.tsx](src/main.tsx) - Global query client setup
- [src/hooks/useVendorDashboard.ts](src/hooks/useVendorDashboard.ts)
- [src/hooks/useVendorAnalytics.ts](src/hooks/useVendorAnalytics.ts)
- [src/hooks/useVendorOrders.ts](src/hooks/useVendorOrders.ts)
- [src/hooks/useAdminDashboard.ts](src/hooks/useAdminDashboard.ts)
