using FoodRescue.DAL.Context;
using FoodRescue.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodRescue.BLL.Extensions.Dashboard.AnalyticsDashboardTab;

public class VendorAnalyticsRepository : IVendorAnalyticsRepository
{
    private readonly CompanyDbContext _context;

    public VendorAnalyticsRepository(CompanyDbContext context)
    {
        _context = context;
    }

    public async Task<AnalyticsStats> GetAnalyticsStatsAsync(Guid vendorId)
    {
        var fromDate = DateTime.Now.AddDays(-30);

        var orders = await _context.Orders
            .AsNoTracking()
            .Where(o => o.Product.VendorId == vendorId && o.CreatedAt >= fromDate)
            .ToListAsync();

        var revenue = orders.Where(o => o.Status == "Completed" || o.Status == "Picked Up")
                           .Sum(o => o.TotalPrice);

        var avgRating = await _context.Reviews
            .AsNoTracking()
            .Where(r => r.Product.VendorId == vendorId)
            .AverageAsync(r => (double?)r.Rating) ?? 0;

        // Calculate repeat customers percentage
        var customerOrderCounts = await _context.Orders
            .AsNoTracking()
            .Where(o => o.Product.VendorId == vendorId)
            .GroupBy(o => o.CustomerId)
            .Select(g => g.Count())
            .ToListAsync();

        var repeatCustomers = customerOrderCounts.Count(c => c > 1);
        var totalCustomers = customerOrderCounts.Count;
        var repeatPercentage = totalCustomers > 0 ? (repeatCustomers * 100 / totalCustomers) : 0;

        return new AnalyticsStats
        {
            Revenue30Days = revenue,
            Orders30Days = orders.Count,
            AverageRating = Math.Round(avgRating, 1),
            RepeatCustomersPercentage = repeatPercentage
        };
    }

    public async Task<RevenueTrendData> GetRevenueTrendAsync(Guid vendorId, string period)
    {
        var months = new[] { "Jan", "Feb", "Mar", "Apr", "May", "Jun" };
        var revenue = new List<decimal>();

        for (int i = 5; i >= 0; i--)
        {
            var monthStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(-i);
            var monthEnd = monthStart.AddMonths(1);

            var monthRevenue = await _context.Orders
                .AsNoTracking()
                .Where(o => o.Product.VendorId == vendorId
                         && o.CreatedAt >= monthStart
                         && o.CreatedAt < monthEnd
                         && (o.Status == "Completed" || o.Status == "Picked Up"))
                .SumAsync(o => o.TotalPrice);

            revenue.Add(monthRevenue);
        }

        return new RevenueTrendData
        {
            Labels = months.ToList(),
            Revenue = revenue
        };
    }

    public async Task<SalesByTypeData> GetSalesByTypeAsync(Guid vendorId)
    {
        // Group by product category
        var categorySales = await _context.Orders
            .AsNoTracking()
            .Where(o => o.Product.VendorId == vendorId
                     && (o.Status == "Completed" || o.Status == "Picked Up"))
            .GroupBy(o => o.Product.Category ?? "Uncategorized")
            .Select(g => new { Category = g.Key, Amount = g.Sum(o => o.TotalPrice) })
            .ToListAsync();

        var total = categorySales.Sum(c => c.Amount);
        var categories = categorySales.Select(c => c.Category).ToList();
        var amounts = categorySales.Select(c => c.Amount).ToList();
        var percentages = categorySales.Select(c => total > 0 ? (int)(c.Amount / total * 100) : 0).ToList();

        return new SalesByTypeData
        {
            Categories = categories,
            Amounts = amounts,
            Percentages = percentages
        };
    }

    public async Task<PeakHoursData> GetPeakPickupHoursAsync(Guid vendorId)
    {
        var hours = new[] { "5 PM", "6 PM", "7 PM", "8 PM", "9 PM" };
        var counts = new List<int>();

        foreach (var hourLabel in hours)
        {
            var hour = hourLabel switch
            {
                "5 PM" => 17,
                "6 PM" => 18,
                "7 PM" => 19,
                "8 PM" => 20,
                "9 PM" => 21,
                _ => 0
            };

            var count = await _context.Orders
                .AsNoTracking()
                .CountAsync(o => o.Product.VendorId == vendorId
                              && o.PickupTime.Hour == hour);

            counts.Add(count);
        }

        var maxIndex = counts.IndexOf(counts.Max());
        var peakTime = hours[maxIndex];
        var peakOrders = counts[maxIndex];

        return new PeakHoursData
        {
            Hours = hours.ToList(),
            OrderCounts = counts,
            PeakTime = peakTime,
            PeakOrders = peakOrders
        };
    }

    public async Task<WeeklyPerformanceData> GetWeeklyPerformanceAsync(Guid vendorId)
    {
        var days = new[] { "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" };

        var thisWeekStart = DateTime.Now.AddDays(-(int)DateTime.Now.DayOfWeek + 1);
        var lastWeekStart = thisWeekStart.AddDays(-7);

        var thisWeek = new List<decimal>();
        var lastWeek = new List<decimal>();

        for (int i = 0; i < 7; i++)
        {
            var thisDay = thisWeekStart.AddDays(i);
            var lastDay = lastWeekStart.AddDays(i);

            var thisDayRevenue = await _context.Orders
                .AsNoTracking()
                .Where(o => o.Product.VendorId == vendorId
                         && o.CreatedAt.Date == thisDay.Date
                         && (o.Status == "Completed" || o.Status == "Picked Up"))
                .SumAsync(o => o.TotalPrice);

            var lastDayRevenue = await _context.Orders
                .AsNoTracking()
                .Where(o => o.Product.VendorId == vendorId
                         && o.CreatedAt.Date == lastDay.Date
                         && (o.Status == "Completed" || o.Status == "Picked Up"))
                .SumAsync(o => o.TotalPrice);

            thisWeek.Add(thisDayRevenue);
            lastWeek.Add(lastDayRevenue);
        }

        return new WeeklyPerformanceData
        {
            Days = days.ToList(),
            ThisWeek = thisWeek,
            LastWeek = lastWeek
        };
    }

    public async Task<List<TopProductData>> GetTopProductsAsync(Guid vendorId, int count)
    {
        var products = await _context.Orders
            .AsNoTracking()
            .Where(o => o.Product.VendorId == vendorId && (o.Status == "Completed" || o.Status == "Picked Up"))
            .GroupBy(o => new { o.Product.Id, o.Product.Name })
            .Select(g => new
            {
                Name = g.Key.Name,
                UnitsSold = g.Count(),
                Revenue = g.Sum(o => o.TotalPrice)
            })
            .OrderByDescending(p => p.Revenue)
            .Take(count)
            .ToListAsync();

        var result = new List<TopProductData>();
        foreach (var product in products)
        {
            var rating = await _context.Reviews
                .AsNoTracking()
                .Where(r => r.Product.Name == product.Name)
                .AverageAsync(r => (double?)r.Rating) ?? 0;

            // Mock growth percentage - calculate from historical data if needed
            var growth = new Random().Next(-5, 15);

            result.Add(new TopProductData
            {
                Name = product.Name,
                UnitsSold = product.UnitsSold,
                Revenue = product.Revenue,
                Rating = Math.Round(rating, 1),
                GrowthPercentage = growth
            });
        }

        return result;
    }

    public async Task<List<TopCustomerData>> GetTopCustomersAsync(Guid vendorId, int count)
    {
        var customers = await _context.Orders
            .AsNoTracking()
            .Where(o => o.Product.VendorId == vendorId)
            .GroupBy(o => new { o.CustomerId, o.Customer.Name })
            .Select(g => new
            {
                Name = g.Key.Name,
                OrderCount = g.Count(),
                TotalSpent = g.Sum(o => o.TotalPrice)
            })
            .OrderByDescending(c => c.TotalSpent)
            .Take(count)
            .ToListAsync();

        var result = new List<TopCustomerData>();
        foreach (var customer in customers)
        {
            var rating = await _context.Reviews
                .AsNoTracking()
                .Where(r => r.User.Name == customer.Name && r.Product.VendorId == vendorId)
                .AverageAsync(r => (double?)r.Rating) ?? 0;

            result.Add(new TopCustomerData
            {
                Name = customer.Name,
                OrderCount = customer.OrderCount,
                TotalSpent = customer.TotalSpent,
                Rating = Math.Round(rating, 1)
            });
        }

        return result;
    }
}
