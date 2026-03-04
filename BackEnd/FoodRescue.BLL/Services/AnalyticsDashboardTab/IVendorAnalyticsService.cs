using FoodRescue.BLL.Contract.AnalyticsDashboardTabDTOs;

namespace FoodRescue.BLL.Services.AnalyticsDashboardTab;
public interface IVendorAnalyticsService
{
    Task<Result<VendorAnalyticsResponse>> GetAnalyticsAsync(Guid vendorId, string period);
}
