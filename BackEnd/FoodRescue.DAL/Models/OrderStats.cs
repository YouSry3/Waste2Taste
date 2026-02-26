namespace FoodRescue.DAL.Models;

public class OrderStats
{
    public decimal TotalRevenue { get; set; }
    public int ReadyForPickupCount { get; set; }
    public int PendingPickupCount { get; set; }
    public decimal AverageOrderValue { get; set; }
}
