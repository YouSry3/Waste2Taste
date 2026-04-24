using FoodRescue.BLL.Contract.Orders.info;
using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace FoodRescue.BLL.Extensions.Orders
{
    public class OrderRepository : IOrderRepository
    {
        private readonly CompanyDbContext _context;

        public OrderRepository(CompanyDbContext context)
        {
            _context = context;
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

                    ProductName = o.Product.Name,
                    VendorName = o.Product.Vendor.Name,
                    ImageUrl = o.Product.ImageUrl,

                    Price = o.Product.Price,

                    PickupTime = o.CreatedAt // or o.PickupTime if you have it
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
                .AsTracking()
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return null;

            order.Status = status;
            await _context.SaveChangesAsync();

            return await GetOrderByIdAsync(id);
        }
    }
}