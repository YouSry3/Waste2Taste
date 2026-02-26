using FoodRescue.DAL.Entities;
using FoodRescue.DAL.Models;

namespace FoodRescue.BLL.Extensions.Dashboard.OrderDashboardTab;

public interface IVendorOrderRepository
{
    Task<List<Order>> GetVendorOrdersAsync(Guid vendorId, OrderFilter filter);
    Task<Order?> GetOrderByIdAsync(Guid orderId, Guid vendorId);
    Task<OrderStats> GetOrderStatsAsync(Guid vendorId);
    Task<bool> UpdateOrderStatusAsync(Guid orderId, Guid vendorId, string status);
}
