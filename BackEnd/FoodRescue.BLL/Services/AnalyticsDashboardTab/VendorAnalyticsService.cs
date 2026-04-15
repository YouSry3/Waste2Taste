using FoodRescue.BLL.Contract.AnalyticsDashboardTabDTOs;
using FoodRescue.BLL.Extensions.Dashboard.AnalyticsDashboardTab;

namespace FoodRescue.BLL.Services.AnalyticsDashboardTab;
public class VendorAnalyticsService : IVendorAnalyticsService
{
    private readonly IVendorAnalyticsRepository _repository;

    public VendorAnalyticsService(IVendorAnalyticsRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<VendorAnalyticsResponse>> GetAnalyticsAsync(Guid vendorId, string period)
    {
        //  FIXED: Sequential execution
        var stats = await _repository.GetAnalyticsStatsAsync(vendorId);
        var revenue = await _repository.GetRevenueTrendAsync(vendorId, period);
        var salesType = await _repository.GetSalesByTypeAsync(vendorId);
        var peakHours = await _repository.GetPeakPickupHoursAsync(vendorId);
        var weekly = await _repository.GetWeeklyPerformanceAsync(vendorId);
        var topProducts = await _repository.GetTopProductsAsync(vendorId, 5);
        var topCustomers = await _repository.GetTopCustomersAsync(vendorId, 5);

        return Result.Success(new VendorAnalyticsResponse
        {
            Summary = new StatsSummaryDto
            {
                Revenue30Days = stats.Revenue30Days,
                Orders30Days = stats.Orders30Days,
                AverageRating = stats.AverageRating,
                RepeatCustomersPercentage = stats.RepeatCustomersPercentage
            },
            RevenueTrend = new RevenueTrendDto
            {
                Labels = revenue.Labels,
                Data = revenue.Revenue
            },
            SalesByType = new SalesByTypeDto
            {
                Labels = salesType.Categories,
                Data = salesType.Percentages,
                Amounts = salesType.Amounts
            },
            PeakHours = new PeakHoursDto
            {
                Labels = peakHours.Hours,
                Data = peakHours.OrderCounts,
                PeakTime = peakHours.PeakTime,
                PeakOrders = peakHours.PeakOrders
            },
            WeeklyPerformance = new WeeklyPerformanceDto
            {
                Labels = weekly.Days,
                ThisWeek = weekly.ThisWeek,
                LastWeek = weekly.LastWeek
            },
            TopProducts = topProducts.Select(p => new AnalyticsTopProductDto
            {
                Name = p.Name,
                UnitsSold = p.UnitsSold,
                Revenue = p.Revenue,
                Rating = p.Rating,
                GrowthPercentage = p.GrowthPercentage
            }).ToList(),
            TopCustomers = topCustomers.Select(c => new AnalyticsTopCustomerDto
            {
                Name = c.Name,
                OrderCount = c.OrderCount,
                TotalSpent = c.TotalSpent,
                Rating = c.Rating
            }).ToList()
        });
    }
}
//public class VendorAnalyticsService : IVendorAnalyticsService
//{
//    private readonly IVendorAnalyticsRepository _repository;

//    public VendorAnalyticsService(IVendorAnalyticsRepository repository)
//    {
//        _repository = repository;
//    }

//    public async Task<Result<VendorAnalyticsResponse>> GetAnalyticsAsync(Guid vendorId, string period)
//    {
//        var statsTask = _repository.GetAnalyticsStatsAsync(vendorId);
//        var revenueTask = _repository.GetRevenueTrendAsync(vendorId, period);
//        var salesTypeTask = _repository.GetSalesByTypeAsync(vendorId);
//        var peakHoursTask = _repository.GetPeakPickupHoursAsync(vendorId);
//        var weeklyTask = _repository.GetWeeklyPerformanceAsync(vendorId);
//        var topProductsTask = _repository.GetTopProductsAsync(vendorId, 5);
//        var topCustomersTask = _repository.GetTopCustomersAsync(vendorId, 5);

//        await Task.WhenAll(statsTask, revenueTask, salesTypeTask,
//                          peakHoursTask, weeklyTask, topProductsTask, topCustomersTask);

//        var stats = await statsTask;
//        var revenue = await revenueTask;
//        var salesType = await salesTypeTask;
//        var peakHours = await peakHoursTask;
//        var weekly = await weeklyTask;
//        var topProducts = await topProductsTask;
//        var topCustomers = await topCustomersTask;

//        var response = new VendorAnalyticsResponse
//        {
//            Summary = new StatsSummaryDto
//            {
//                Revenue30Days = stats.Revenue30Days,
//                Orders30Days = stats.Orders30Days,
//                AverageRating = stats.AverageRating,
//                RepeatCustomersPercentage = stats.RepeatCustomersPercentage
//            },
//            RevenueTrend = new RevenueTrendDto
//            {
//                Labels = revenue.Labels,
//                Data = revenue.Revenue
//            },
//            SalesByType = new SalesByTypeDto
//            {
//                Labels = salesType.Categories,
//                Data = salesType.Percentages,
//                Amounts = salesType.Amounts
//            },
//            PeakHours = new PeakHoursDto
//            {
//                Labels = peakHours.Hours,
//                Data = peakHours.OrderCounts,
//                PeakTime = peakHours.PeakTime,
//                PeakOrders = peakHours.PeakOrders
//            },
//            WeeklyPerformance = new WeeklyPerformanceDto
//            {
//                Labels = weekly.Days,
//                ThisWeek = weekly.ThisWeek,
//                LastWeek = weekly.LastWeek
//            },
//            TopProducts = topProducts.Select(p => new AnalyticsTopProductDto
//            {
//                Name = p.Name,
//                UnitsSold = p.UnitsSold,
//                Revenue = p.Revenue,
//                Rating = p.Rating,
//                GrowthPercentage = p.GrowthPercentage
//            }).ToList(),
//            TopCustomers = topCustomers.Select(c => new AnalyticsTopCustomerDto
//            {
//                Name = c.Name,
//                OrderCount = c.OrderCount,
//                TotalSpent = c.TotalSpent,
//                Rating = c.Rating
//            }).ToList()
//        };

//        return Result.Success(response);
//    }
//}
