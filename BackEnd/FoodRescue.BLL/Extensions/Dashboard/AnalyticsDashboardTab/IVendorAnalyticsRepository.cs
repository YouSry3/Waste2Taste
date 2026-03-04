using FoodRescue.DAL.Models;

namespace FoodRescue.BLL.Extensions.Dashboard.AnalyticsDashboardTab;

public interface IVendorAnalyticsRepository
{
    Task<AnalyticsStats> GetAnalyticsStatsAsync(Guid vendorId);
    Task<RevenueTrendData> GetRevenueTrendAsync(Guid vendorId, string period);
    Task<SalesByTypeData> GetSalesByTypeAsync(Guid vendorId);
    Task<PeakHoursData> GetPeakPickupHoursAsync(Guid vendorId);
    Task<WeeklyPerformanceData> GetWeeklyPerformanceAsync(Guid vendorId);
    Task<List<TopProductData>> GetTopProductsAsync(Guid vendorId, int count);
    Task<List<TopCustomerData>> GetTopCustomersAsync(Guid vendorId, int count);
}
