using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Contract.Orders.Create;
using FoodRescue.DAL.Entities;

namespace FoodRescue.BLL.Services.Orders
{
    public interface IOrderService
    {
        Task<Result<OrderResponse>> CreateOrderAsync(OrderRequest request, Guid userId);
        Task<Order?> GetOrderByIdAsync(Guid id);  //  Guid not int
        Task<List<Order>> GetOrdersByCustomerAsync(Guid customerId);
        Task<List<Order>> GetOrdersByVendorAsync(Guid vendorId);
        Task<Order?> UpdateOrderStatusAsync(Guid id, string status);  // Guid not int
    }
}
