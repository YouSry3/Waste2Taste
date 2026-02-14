using FoodRescue.BLL.Extensions.Orders;
using FoodRescue.BLL.Extensions.Products;
using FoodRescue.DAL.Entities;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Services.Orders
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepo;
        private readonly IProductRepository _productRepo;

        public OrderService(IOrderRepository repo, IProductRepository productRepo)
        {
            _orderRepo = repo;
            _productRepo = productRepo;
        }


        public async Task<Order> CreateOrderAsync(Order order)
        {
            // Validation
            if (order.ProuductId == Guid.Empty)
                throw new Exception("Order must have a valid product.");
            var product = await _productRepo.GetByIdAsync(order.ProuductId);

            if (product!.Quantity <= 0)
                throw new Exception("Quantity must be greater than zero.");

            if (order.CustomerId == Guid.Empty)
                throw new Exception("Customer ID is required.");

            // Get product to calculate price
            

            if (product == null)
                throw new Exception("Product not found.");

          
            // Calculate total price
            decimal productPrice = product.Price ;
            decimal discountAmount = 0;

            if (product.Discount > 0)
            {
                if (product.Discount > 100)
                    throw new Exception("Discount cannot exceed 100%.");

                discountAmount = productPrice * (product.Discount / 100);
            }

            order.TotalPrice = productPrice - discountAmount;

            if (string.IsNullOrEmpty(order.Status))
                order.Status = "Pending";

            order.CreatedAt = DateTime.UtcNow;

            // Update product quantity
            product.Quantity--;

            await _productRepo.UpdateAsync(product);

            return await _orderRepo.AddOrderAsync(order);
        }

        public async Task<Order> GetOrderByIdAsync(int id)
        {
            var order = await _orderRepo.GetOrderByIdAsync(id);

            if (order == null)
                throw new ArgumentException("Invalid Order Undefinded."); ;

            return order;
        }

        public async Task<List<Order>> GetOrdersByCustomerAsync(Guid customerId)
        {
            if (customerId == Guid.Empty)
                throw new ArgumentException("Invalid customer ID.");

            return await _orderRepo.GetOrdersByCustomerAsync(customerId);
        }

        public async Task<List<Order>> GetOrdersByVendorAsync(Guid vendorId)
        {
            if (vendorId == Guid.Empty)
                throw new ArgumentException("Invalid vendor ID.");

            return await _orderRepo.GetOrdersByVendorAsync(vendorId);
        }

        public async Task<Order> UpdateOrderStatusAsync(int id, string status)
        {
            if (string.IsNullOrEmpty(status))
                throw new ArgumentException("Status cannot be empty.");

            return await _orderRepo.UpdateOrderStatusAsync(id, status);
        }
    }
}
