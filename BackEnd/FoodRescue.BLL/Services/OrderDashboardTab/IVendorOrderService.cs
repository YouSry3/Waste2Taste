using FoodRescue.BLL.Contract.OrderDashboardTabDTOs;
using FoodRescue.DAL.Models;

namespace FoodRescue.BLL.Services.OrderDashboardTab;

public interface IVendorOrderService
{
    Task<Result<VendorOrderListResponse>> GetOrdersAsync(Guid vendorId, OrderFilter filter);
    Task<Result<VendorOrderDto?>> GetOrderByIdAsync(Guid orderId, Guid vendorId);
    Task<Result<bool>> UpdateOrderStatusAsync(Guid orderId, Guid vendorId, string status);
}
