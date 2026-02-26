namespace FoodRescue.BLL.Contract.VendorDashboard;

public class RecentOrderDto
{
    public string OrderId { get; set; } = null!;
    public string CustomerName { get; set; } = null!;
    public string? CustomerPhone { get; set; }
    public string ProductName { get; set; } = null!;
    public decimal Amount { get; set; }
    public string PickupTime { get; set; } = null!;
    public string PickupLocation { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string? VendorPhone { get; set; }
}
