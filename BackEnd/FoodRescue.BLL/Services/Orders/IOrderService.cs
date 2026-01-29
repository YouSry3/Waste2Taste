using FoodRescue.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Services.Orders
{
    public interface IOrderService
    {
        Task<Order> CreateOrderAsync(Order order);
        Task<List<Order>> GetOrdersByCustomerAsync(string customerId);
        Task<List<Order>> GetOrdersByVendorAsync(string vendorId);
        Task<Order> GetOrderByIdAsync(int id, string userId, string role);
        Task<Order> UpdateOrderStatusAsync(int id, string status);
    }
}
