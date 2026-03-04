namespace FoodRescue.DAL.Models;

public class WeeklyPerformanceData
{
    public List<string> Days { get; set; } = new();
    public List<decimal> ThisWeek { get; set; } = new();
    public List<decimal> LastWeek { get; set; } = new();
}
