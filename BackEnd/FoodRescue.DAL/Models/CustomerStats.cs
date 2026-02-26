namespace FoodRescue.DAL.Models;

public class CustomerStats
{
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = null!;
    public int OrderCount { get; set; }
    public decimal TotalSpent { get; set; }
    public double Rating { get; set; }  // Calculated from reviews
}
