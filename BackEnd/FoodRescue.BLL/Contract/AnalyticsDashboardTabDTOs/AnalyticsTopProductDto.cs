namespace FoodRescue.BLL.Contract.AnalyticsDashboardTabDTOs;
public class AnalyticsTopProductDto
{
    public string Name { get; set; } = null!;
    public int UnitsSold { get; set; }
    public decimal Revenue { get; set; }
    public double Rating { get; set; }
    public int GrowthPercentage { get; set; }
}
