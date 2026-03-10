export interface Stats {
  activeListings: number;
  revenue30Days: number;
  totalOrders: number;
  foodSavedLbs: number;
  pickupsToday: number;
  averageRating: number;
}

export interface MonthlyGoals {
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

export interface ExpiringProduct {
  id: string;
  name: string;
  stock: number;
  expiresAt: string;
  timeRemaining: string;
  isUrgent: boolean;
}

export interface RecentOrder {
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

export interface TopCustomer {
  name: string;
  orderCount: number;
  totalSpent: number;
  rating: number;
}

export interface EnvironmentalImpact {
  foodSavedLbs: number;
  co2PreventedKg: number;
  mealsProvided: number;
}

export interface VendorDashboardResponse {
  stats: Stats;
  monthlyGoals: MonthlyGoals;
  expiringSoon: ExpiringProduct[];
  recentOrders: RecentOrder[];
  topCustomers: TopCustomer[];
  environmentalImpact: EnvironmentalImpact;
}
