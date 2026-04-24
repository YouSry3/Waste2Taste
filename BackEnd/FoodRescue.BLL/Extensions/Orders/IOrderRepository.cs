using FoodRescue.BLL.Contract.Orders.info;
using FoodRescue.DAL.Entities;

namespace FoodRescue.BLL.Extensions.Orders
{
    public interface IOrderRepository
    {
        Task<Order> AddOrderAsync(Order order);
        Task<List<CustomerOrderDto>> GetOrdersByCustomerAsync(Guid customerId);
        Task<List<Order>> GetOrdersByVendorAsync(Guid vendorId);
        Task<Order?> GetOrderByIdAsync(Guid id);  //  Guid not int
        Task<Order?> UpdateOrderStatusAsync(Guid id, string status);  //  Guid not int
    }
}
