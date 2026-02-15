using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Contract.Orders.Create;
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
        Task<Result<OrderResponse>> CreateOrderAsync(OrderRequest request, Guid userId);
        Task<List<Order>> GetOrdersByCustomerAsync(Guid customerId);
        Task<List<Order>> GetOrdersByVendorAsync(Guid vendorId);
        Task<Order> GetOrderByIdAsync(int id);
        Task<Order> UpdateOrderStatusAsync(int id, string status);
    }
}
