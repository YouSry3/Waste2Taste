using FoodRescue.BLL.Extensions.Orders;
using FoodRescue.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Services.Orders
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _repo;

        public OrderService(IOrderRepository repo)
        {
            _repo = repo;
        }

        public async Task<Order> CreateOrderAsync(Order order)
        {
            if (order.Items == null || order.Items.Count == 0)
                throw new Exception("Order must have at least one item.");

            decimal total = 0;
            foreach (var item in order.Items)
                total += item.Quantity * 10; // سعر وهمي لأي حساب Total

            order.TotalPrice = total;

            return await _repo.AddOrderAsync(order);
        }

        public Task<List<Order>> GetOrdersByCustomerAsync(string customerId) =>
            _repo.GetOrdersByCustomerAsync(customerId);

        public Task<List<Order>> GetOrdersByVendorAsync(string vendorId) =>
            _repo.GetOrdersByVendorAsync(vendorId);

        public async Task<Order> GetOrderByIdAsync(int id, string userId, string role)
        {
            var order = await _repo.GetOrderByIdAsync(id);
            if (order == null) return null;

            if (order.CustomerId != userId && order.VendorId != userId && role != "Admin")
                throw new UnauthorizedAccessException();

            return order;
        }

        public Task<Order> UpdateOrderStatusAsync(int id, string status) =>
            _repo.UpdateOrderStatusAsync(id, status);
    }
}
