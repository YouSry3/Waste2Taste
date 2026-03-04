namespace FoodRescue.BLL.Contract.AnalyticsDashboardTabDTOs;

public class RevenueTrendDto
{
    public List<string> Labels { get; set; } = new();
    public List<decimal> Data { get; set; } = new();
}
