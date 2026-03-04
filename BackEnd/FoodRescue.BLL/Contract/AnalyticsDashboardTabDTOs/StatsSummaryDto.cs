namespace FoodRescue.BLL.Contract.AnalyticsDashboardTabDTOs;

public class StatsSummaryDto
{
    public decimal Revenue30Days { get; set; }
    public int Orders30Days { get; set; }
    public double AverageRating { get; set; }
    public int RepeatCustomersPercentage { get; set; }
}
