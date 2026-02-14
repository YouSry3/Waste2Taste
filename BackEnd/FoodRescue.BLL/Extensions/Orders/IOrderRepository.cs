using FoodRescue.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Extensions.Orders
{
    public interface IOrderRepository
    {
        Task<Order> AddOrderAsync(Order order);
        Task<List<Order>> GetOrdersByCustomerAsync(Guid customerId);
        Task<List<Order>> GetOrdersByVendorAsync(Guid vendorId);
        Task<Order> GetOrderByIdAsync(int id);
        Task<Order> UpdateOrderStatusAsync(int id, string status);
    }
}
