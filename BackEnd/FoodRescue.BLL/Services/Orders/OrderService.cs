using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Abstractions.TypeErrors;
using FoodRescue.BLL.Contract.Orders.Create;
using FoodRescue.BLL.Extensions.Orders;
using FoodRescue.BLL.Extensions.Products;
using FoodRescue.BLL.Extensions.Users;
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
        private readonly IUserRepository _userRepository;

        public OrderService(IOrderRepository repo, IProductRepository productRepo,IUserRepository userRepository)
        {
            _orderRepo = repo;
            _productRepo = productRepo;
            _userRepository = userRepository;
        }


        public async Task<Result<OrderResponse>> CreateOrderAsync(OrderRequest request, Guid userId)
        {

            bool isCustomer = await _userRepository.IsCustomer(userId);
            if (!isCustomer)
                return Result.Failure<OrderResponse>(UserErrors.OnlyCustomerAccess);

            var product = await _productRepo.GetByIdAsync(request.ProductId);
            if (product == null)
                return Result.Failure<OrderResponse>(error: ProductErrors.NotFound);

            if (product.Quantity <= 0)
                return Result.Failure<OrderResponse>(ProductErrors.InvalidQuantity);

            if (product.Discount > 100)
                return Result.Failure<OrderResponse>(ProductErrors.InvalidDiscount);

            decimal discountAmount = product.Price * (product.Discount / 100);
            
            var order = new Order
            {
                CustomerId = userId,
                ProuductId = request.ProductId,
                TotalPrice = product.Price - discountAmount,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };
            var response = new OrderResponse
            {
                Id = userId,
                TotalPrice = product.Price - discountAmount,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow,
               
                ProductName = product.Name
            };

            product.Quantity--;

            await _productRepo.UpdateAsync(product);
            await _orderRepo.AddOrderAsync(order);

            return Result.Success(response);
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
