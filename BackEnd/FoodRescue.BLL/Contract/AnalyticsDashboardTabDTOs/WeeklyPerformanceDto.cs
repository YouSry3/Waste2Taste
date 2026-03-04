namespace FoodRescue.BLL.Contract.AnalyticsDashboardTabDTOs;
public class WeeklyPerformanceDto
{
    public List<string> Labels { get; set; } = new();
    public List<decimal> ThisWeek { get; set; } = new();
    public List<decimal> LastWeek { get; set; } = new();
}
