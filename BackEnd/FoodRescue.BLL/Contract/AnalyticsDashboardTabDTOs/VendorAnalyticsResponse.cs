namespace FoodRescue.BLL.Contract.AnalyticsDashboardTabDTOs;
public class VendorAnalyticsResponse
{
    public StatsSummaryDto Summary { get; set; } = null!;
    public RevenueTrendDto RevenueTrend { get; set; } = null!;
    public SalesByTypeDto SalesByType { get; set; } = null!;
    public PeakHoursDto PeakHours { get; set; } = null!;
    public WeeklyPerformanceDto WeeklyPerformance { get; set; } = null!;
    public List<AnalyticsTopProductDto> TopProducts { get; set; } = new();
    public List<AnalyticsTopCustomerDto> TopCustomers { get; set; } = new();
}
