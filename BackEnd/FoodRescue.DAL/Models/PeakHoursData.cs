namespace FoodRescue.DAL.Models;

public class PeakHoursData
{
    public List<string> Hours { get; set; } = new();
    public List<int> OrderCounts { get; set; } = new();
    public string PeakTime { get; set; } = null!;
    public int PeakOrders { get; set; }
}
