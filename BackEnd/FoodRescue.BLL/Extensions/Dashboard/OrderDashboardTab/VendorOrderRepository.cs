using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using FoodRescue.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodRescue.BLL.Extensions.Dashboard.OrderDashboardTab;

public class VendorOrderRepository : IVendorOrderRepository
{
    private readonly CompanyDbContext _context;

    public VendorOrderRepository(CompanyDbContext context)
    {
        _context = context;
    }

    public async Task<List<Order>> GetVendorOrdersAsync(Guid vendorId, OrderFilter filter)
    {
        var query = _context.Orders
            .AsNoTracking()
            .Include(o => o.Customer)
            .Include(o => o.Product)
                .ThenInclude(p => p.Vendor)
            .Where(o => o.Product.VendorId == vendorId);

        if (!string.IsNullOrEmpty(filter.SearchTerm))
        {
            query = query.Where(o =>
                o.Customer.Name.Contains(filter.SearchTerm) ||
                o.Product.Name.Contains(filter.SearchTerm) ||
                o.Id.ToString().Contains(filter.SearchTerm));
        }

        if (!string.IsNullOrEmpty(filter.Status) && filter.Status != "All")
        {
            query = query.Where(o => o.Status == filter.Status);
        }

        if (filter.MinPrice.HasValue)
            query = query.Where(o => o.TotalPrice >= filter.MinPrice.Value);

        if (filter.MaxPrice.HasValue)
            query = query.Where(o => o.TotalPrice <= filter.MaxPrice.Value);

        if (filter.FromDate.HasValue)
            query = query.Where(o => o.CreatedAt >= filter.FromDate.Value);

        if (filter.ToDate.HasValue)
            query = query.Where(o => o.CreatedAt <= filter.ToDate.Value);

        query = filter.SortBy switch
        {
            "NewestFirst" => query.OrderByDescending(o => o.CreatedAt),
            "OldestFirst" => query.OrderBy(o => o.CreatedAt),
            "HighestAmount" => query.OrderByDescending(o => o.TotalPrice),
            "LowestAmount" => query.OrderBy(o => o.TotalPrice),
            _ => query.OrderByDescending(o => o.CreatedAt)
        };

        return await query.ToListAsync();
    }

    public async Task<Order?> GetOrderByIdAsync(Guid orderId, Guid vendorId)
    {
        return await _context.Orders
            .AsNoTracking()
            .Include(o => o.Customer)
            .Include(o => o.Product)
                .ThenInclude(p => p.Vendor)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.Product.VendorId == vendorId);
    }

    public async Task<OrderStats> GetOrderStatsAsync(Guid vendorId)
    {
        var orders = await _context.Orders
            .AsNoTracking()
            .Where(o => o.Product.VendorId == vendorId)
            .ToListAsync();

        var completedOrders = orders.Where(o =>
            o.Status == "Completed" || o.Status == "Picked Up").ToList();

        return new OrderStats
        {
            TotalRevenue = completedOrders.Sum(o => o.TotalPrice),
            ReadyForPickupCount = orders.Count(o => o.Status == "Ready for Pickup"),
            PendingPickupCount = orders.Count(o => o.Status == "Pending Pickup"),
            AverageOrderValue = completedOrders.Any()
                ? completedOrders.Average(o => o.TotalPrice)
                : 0
        };
    }

    public async Task<bool> UpdateOrderStatusAsync(Guid orderId, Guid vendorId, string status)
    {
        var order = await _context.Orders
            .Include(o => o.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.Product.VendorId == vendorId);

        if (order == null) return false;

        order.Status = status;
        await _context.SaveChangesAsync();
        return true;
    }
}
