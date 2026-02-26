//using FoodRescue.BLL.Extensions.Dashboard.Models;
using FoodRescue.DAL.Entities;
using FoodRescue.DAL.Models;

namespace FoodRescue.BLL.Extensions.Dashboard;

public interface IVendorDashboardRepository
{
    Task<int> GetActiveListingsCountAsync(Guid vendorId);
    Task<decimal> GetTotalRevenueAsync(Guid vendorId, int days);
    Task<int> GetTotalOrdersCountAsync(Guid vendorId);
    Task<double> GetFoodSavedKgAsync(Guid vendorId);
    Task<int> GetPickupsTodayCountAsync(Guid vendorId);
    Task<double> GetAverageRatingAsync(Guid vendorId);
    Task<List<Product>> GetExpiringSoonProductsAsync(Guid vendorId, int hours);
    Task<List<Order>> GetRecentOrdersAsync(Guid vendorId, int count);
    Task<List<CustomerStats>> GetTopCustomersAsync(Guid vendorId, int count);
    Task<MonthlyGoals> GetMonthlyGoalsProgressAsync(Guid vendorId);
    Task<EnvironmentalImpact> GetEnvironmentalImpactAsync(Guid vendorId);
}
