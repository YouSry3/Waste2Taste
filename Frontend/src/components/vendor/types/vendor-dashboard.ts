// src/types/vendor-dashboard.ts

export interface VendorDashboardStats {
  activeListings: number;
  revenue30Days: number;
  totalOrders: number;
  foodSavedLbs: number;
  pickupsToday: number;
  averageRating: number;
}

export interface VendorMonthlyGoals {
  foodSavedCurrent: number;
  foodSavedTarget: number;
  foodSavedPercentage: number;
  revenueCurrent: number;
  revenueTarget: number;
  revenuePercentage: number;
  ratingCurrent: number;
  ratingTarget: number;
  ratingPercentage: number;
}

export interface VendorExpiringItem {
  id: string;
  name: string;
  stock: number;
  expiresAt: string;
  timeRemaining: string;
  isUrgent: boolean;
}

export interface VendorRecentOrder {
  orderId: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  amount: number;
  pickupTime: string;
  pickupLocation: string;
  status: string;
  vendorPhone: string;
}

export interface VendorTopCustomer {
  name: string;
  orderCount: number;
  totalSpent: number;
  rating: number;
}

export interface VendorEnvironmentalImpact {
  foodSavedLbs: number;
  co2PreventedKg: number;
  mealsProvided: number;
}

export interface VendorDashboardResponse {
  stats: VendorDashboardStats;
  monthlyGoals: VendorMonthlyGoals;
  expiringSoon: VendorExpiringItem[];
  recentOrders: VendorRecentOrder[];
  topCustomers: VendorTopCustomer[];
  environmentalImpact: VendorEnvironmentalImpact;
}
