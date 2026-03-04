namespace FoodRescue.DAL.Models;

public class RevenueTrendData
{
    public List<string> Labels { get; set; } = new();
    public List<decimal> Revenue { get; set; } = new();
}
