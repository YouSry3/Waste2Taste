using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using FoodRescue.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodRescue.BLL.Extensions.Dashboard;

public class VendorDashboardRepository : IVendorDashboardRepository
{
    private readonly CompanyDbContext _context;

    public VendorDashboardRepository(CompanyDbContext context)
    {
        _context = context;
    }

    public async Task<int> GetActiveListingsCountAsync(Guid vendorId)
    {
        return await _context.Products
            .AsNoTracking()
            .CountAsync(p => p.VendorId == vendorId
                          && !p.Expired
                          && p.Quantity > 0
                          && p.ExpiryDate > DateTime.Now);
    }

    public async Task<decimal> GetTotalRevenueAsync(Guid vendorId, int days)
    {
        var fromDate = DateTime.Now.AddDays(-days);
        return await _context.Orders
            .AsNoTracking()
            .Where(o => o.Product.VendorId == vendorId
                     && o.CreatedAt >= fromDate
                     && (o.Status == "Completed" || o.Status == "Picked Up"))
            .SumAsync(o => o.TotalPrice);
    }

    public async Task<int> GetTotalOrdersCountAsync(Guid vendorId)
    {
        return await _context.Orders
            .AsNoTracking()
            .CountAsync(o => o.Product.VendorId == vendorId);
    }

    public async Task<double> GetFoodSavedKgAsync(Guid vendorId)
    {
        var orderCount = await _context.Orders
            .AsNoTracking()
            .CountAsync(o => o.Product.VendorId == vendorId
                          && (o.Status == "Completed" || o.Status == "Picked Up"));
        return orderCount * 2.5 * 0.453592; // lbs to kg conversion
    }

    public async Task<int> GetPickupsTodayCountAsync(Guid vendorId)
    {
        var today = DateTime.Now.Date;
        var tomorrow = today.AddDays(1);
        return await _context.Orders
            .AsNoTracking()
            .CountAsync(o => o.Product.VendorId == vendorId
                          && o.CreatedAt >= today
                          && o.CreatedAt < tomorrow);
    }

    public async Task<double> GetAverageRatingAsync(Guid vendorId)
    {
        var avgRating = await _context.Reviews
            .AsNoTracking()
            .Where(r => r.Product.VendorId == vendorId)
            .AverageAsync(r => (double?)r.Rating);
        return avgRating ?? 0;
    }

    public async Task<List<Product>> GetExpiringSoonProductsAsync(Guid vendorId, int hours)
    {
        var threshold = DateTime.Now.AddHours(hours);
        return await _context.Products
            .AsNoTracking()
            .Where(p => p.VendorId == vendorId
                     && !p.Expired
                     && p.Quantity > 0
                     && p.ExpiryDate <= threshold
                     && p.ExpiryDate > DateTime.Now)
            .OrderBy(p => p.ExpiryDate)
            .Take(5)
            .ToListAsync();
    }

    public async Task<List<Order>> GetRecentOrdersAsync(Guid vendorId, int count)
    {
        return await _context.Orders
            .AsNoTracking()
            .Include(o => o.Customer)
            .Include(o => o.Product)
                .ThenInclude(p => p.Vendor)
            .Where(o => o.Product.VendorId == vendorId)
            .OrderByDescending(o => o.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task<List<CustomerStats>> GetTopCustomersAsync(Guid vendorId, int count)
    {
        return await _context.Orders
            .AsNoTracking()
            .Where(o => o.Product.VendorId == vendorId)
            .GroupBy(o => new { o.CustomerId, o.Customer.Name })
            .Select(g => new CustomerStats
            {
                CustomerId = g.Key.CustomerId,
                CustomerName = g.Key.Name,
                OrderCount = g.Count(),
                TotalSpent = g.Sum(o => o.TotalPrice)
            })
            .OrderByDescending(c => c.TotalSpent)
            .Take(count)
            .ToListAsync();
    }

    public async Task<MonthlyGoals> GetMonthlyGoalsProgressAsync(Guid vendorId)
    {
        var startOfMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);

        var foodSaved = await _context.Orders
            .AsNoTracking()
            .Where(o => o.Product.VendorId == vendorId
                     && o.CreatedAt >= startOfMonth
                     && (o.Status == "Completed" || o.Status == "Picked Up"))
            .CountAsync() * 2.5;

        var revenue = await _context.Orders
            .AsNoTracking()
            .Where(o => o.Product.VendorId == vendorId
                     && o.CreatedAt >= startOfMonth
                     && (o.Status == "Completed" || o.Status == "Picked Up"))
            .SumAsync(o => o.TotalPrice);

        var rating = await GetAverageRatingAsync(vendorId);

        return new MonthlyGoals
        {
            FoodSavedCurrent = foodSaved,
            FoodSavedTarget = 1500,
            RevenueCurrent = revenue,
            RevenueTarget = 750,
            RatingCurrent = rating,
            RatingTarget = 4.5
        };
    }

    public async Task<EnvironmentalImpact> GetEnvironmentalImpactAsync(Guid vendorId)
    {
        var completedOrders = await _context.Orders
            .AsNoTracking()
            .CountAsync(o => o.Product.VendorId == vendorId
                          && (o.Status == "Completed" || o.Status == "Picked Up"));

        var lbsSaved = completedOrders * 2.5;

        return new EnvironmentalImpact
        {
            FoodSavedLbs = lbsSaved,
            Co2PreventedKg = lbsSaved * 0.5,
            MealsProvided = (int)(lbsSaved / 1.2)
        };
    }
}
