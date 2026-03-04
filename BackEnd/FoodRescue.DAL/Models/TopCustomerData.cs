namespace FoodRescue.DAL.Models;

public class TopCustomerData
{
    public string Name { get; set; } = null!;
    public int OrderCount { get; set; }
    public decimal TotalSpent { get; set; }
    public double Rating { get; set; }
}
