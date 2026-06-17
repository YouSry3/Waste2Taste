using FoodRescue.BLL.Contract.Orders;
using FoodRescue.BLL.Contract.Orders.info;
using FoodRescue.BLL.Services.Notification;
using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace FoodRescue.BLL.Extensions.Orders
{
    public class OrderRepository : IOrderRepository
    {
        private readonly CompanyDbContext _context;
        private readonly INotificationService _notificationService;

        public OrderRepository(CompanyDbContext context,INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task<Order> AddOrderAsync(Order order)
        {
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            return await GetOrderByIdAsync(order.Id);
        }

        public async Task<List<CustomerOrderDto>> GetOrdersByCustomerAsync(Guid customerId)
        {
            return await _context.Orders
                .AsNoTracking()
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new CustomerOrderDto
                {
                    OrderNumber = o.Id.ToString().Substring(0, 6), // or custom number
                    Status = o.Status.ToString(),
                    VendorId = o.Product.Vendor.Id,
                    VendorName = o.Product.Vendor.Name,
                    Latitude = o.Product.Vendor.Latitude,
                    Longitude = o.Product.Vendor.Longitude,
                    OrderId = o.Id,
                    ProductName = o.Product.Name,
                    ImageUrl = o.Product.ImageUrl,
                    Price = o.Product.Price,
                    PickupTime = o.PickupTime.Kind == DateTimeKind.Unspecified
    ? DateTime.SpecifyKind(o.PickupTime, DateTimeKind.Utc)
    : o.PickupTime
                })
                .ToListAsync();
        }

        public async Task<List<Order>> GetOrdersByVendorAsync(Guid vendorId)
        {
            return await _context.Orders
                .AsNoTracking()
                .Include(o => o.Product)
                    .ThenInclude(p => p.Vendor)
                .Include(o => o.Customer)
                .Where(o => o.Product.VendorId == vendorId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        // 🔴 UPDATED: Include Vendor with PhoneNumber
        public async Task<Order?> GetOrderByIdAsync(Guid id)
        {
            return await _context.Orders
                .AsNoTracking()
                .Include(o => o.Product)
                    .ThenInclude(p => p.Vendor)
                .Include(o => o.Customer)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<Order?> UpdateOrderStatusAsync(Guid id, string status)
        {
            var order = await _context.Orders
                .Include(o => o.Customer) // IMPORTANT
                .AsTracking()
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return null;

            order.Status = status;

            await _context.SaveChangesAsync();

            return order;
        }
        public async Task<List<AdminOrderDto>> GetAllOrdersAsync()
        {
            return await _context.Orders
        .AsNoTracking()
        .OrderByDescending(o => o.CreatedAt)
        .Select(o => new AdminOrderDto
        {
            Id = o.Id,
            Status = o.Status,
            TotalPrice = o.TotalPrice,
            CreatedAt = o.CreatedAt,
            PickupTime = o.PickupTime,
            CustomerId = o.CustomerId,
            CustomerName = o.Customer.Name,
            CustomerEmail = o.Customer.Email,
            ProductId = o.ProductId,
            ProductName = o.Product.Name,
            ProductImageUrl = o.Product.ImageUrl,
            VendorId = o.Product.VendorId,
            VendorName = o.Product.Vendor.Name
        })
        .ToListAsync();
        }
    }
}