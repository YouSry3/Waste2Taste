namespace FoodRescue.BLL.Contract.OrderDashboardTabDTOs;

public class OrderStatsDto
{
    public decimal TotalRevenue { get; set; }
    public int ReadyForPickup { get; set; }
    public int PendingPickup { get; set; }
    public decimal AverageOrderValue { get; set; }
}

