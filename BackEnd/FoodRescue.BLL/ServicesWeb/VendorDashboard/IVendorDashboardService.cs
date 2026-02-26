using FoodRescue.BLL.Contract.VendorDashboard;

namespace FoodRescue.BLL.ServicesWeb.VendorDashboard;

public interface IVendorDashboardService
{
    Task<Result<VendorDashboardResponse>> GetDashboardAsync(Guid vendorId);
}
