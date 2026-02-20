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

        public async Task<List<Order>> GetOrdersByCustomerAsync(Guid customerId)
        {
            return await _context.Orders
                .AsNoTracking()
                .Include(o => o.Product)
                .Include(o => o.Customer)
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.CreatedAt)
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