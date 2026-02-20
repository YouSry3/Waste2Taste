using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Abstractions.TypeErrors;
using FoodRescue.BLL.Contract.Orders.Create;
using FoodRescue.BLL.Extensions.Orders;
using FoodRescue.BLL.Extensions.Products;
using FoodRescue.BLL.Extensions.Users;
using FoodRescue.DAL.Entities;

namespace FoodRescue.BLL.Services.Orders
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepo;
        private readonly IProductRepository _productRepo;
        private readonly IUserRepository _userRepository;

        public OrderService(IOrderRepository repo, IProductRepository productRepo, IUserRepository userRepository)
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
                return Result.Failure<OrderResponse>(ProductErrors.NotFound);

            if (product.Quantity <= 0)
                return Result.Failure<OrderResponse>(ProductErrors.InvalidQuantity);

            // Calculate discount from OriginalPrice vs Price
            decimal discountPercentage = product.OriginalPrice > 0
                ? (product.OriginalPrice - product.Price) / product.OriginalPrice * 100
                : 0;

            if (discountPercentage > 100)
                return Result.Failure<OrderResponse>(ProductErrors.InvalidDiscount);

            // 🔴 ADDED: Validate PickupTime is in the future
            if (request.PickupTime <= DateTime.Now)
                return Result.Failure<OrderResponse>(new Error("InvalidPickupTime", "Pickup time must be in the future"));

            var order = new Order
            {
                Id = Guid.NewGuid(),
                CustomerId = userId,
                ProductId = request.ProductId,
                TotalPrice = product.Price,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow,
                PickupTime = request.PickupTime  // 🔴 ADDED: Set pickup time from request
            };

            var response = new OrderResponse
            {
                Id = order.Id,
                TotalPrice = product.Price,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow,
                PickupTime = order.PickupTime,  // 🔴 ADDED: Include in response
                ProductName = product.Name
            };

            product.Quantity--;

            await _productRepo.UpdateAsync(product);
            await _orderRepo.AddOrderAsync(order);

            return Result.Success(response);
        }

        public async Task<Order?> GetOrderByIdAsync(Guid id)
        {
            var order = await _orderRepo.GetOrderByIdAsync(id);
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

        public async Task<Order?> UpdateOrderStatusAsync(Guid id, string status)
        {
            if (string.IsNullOrEmpty(status))
                throw new ArgumentException("Status cannot be empty.");

            return await _orderRepo.UpdateOrderStatusAsync(id, status);
        }
    }
}
