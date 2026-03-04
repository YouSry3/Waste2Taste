namespace FoodRescue.BLL.Contract.AnalyticsDashboardTabDTOs;
public class AnalyticsTopCustomerDto
{
    public string Name { get; set; } = null!;
    public int OrderCount { get; set; }
    public decimal TotalSpent { get; set; }
    public double Rating { get; set; }
}
