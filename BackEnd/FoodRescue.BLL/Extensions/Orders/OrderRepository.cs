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

            // Reload the order with related entities
            return await GetOrderByIdAsync(order.Id);
        }

        public async Task<List<Order>> GetOrdersByCustomerAsync(Guid customerId)
        {
            return await _context.Orders
                .Include(o => o.Product)
                .Include(o => o.Customer)
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Order>> GetOrdersByVendorAsync(Guid vendorId)
        {
            return await _context.Orders
                .Include(o => o.Product)
                    .ThenInclude(p => p.Vendor)
                .Include(o => o.Customer)
                .Where(o => o.Product.VendorId == vendorId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id)
        {
            return await _context.Orders
                .Include(o => o.Product)
                    .ThenInclude(p => p.Vendor)
                .Include(o => o.Customer)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<Order> UpdateOrderStatusAsync(int id, string status)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
                return null;

            order.Status = status;

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            // Return the updated order with related entities
            return await GetOrderByIdAsync(id);
        }
    }
}