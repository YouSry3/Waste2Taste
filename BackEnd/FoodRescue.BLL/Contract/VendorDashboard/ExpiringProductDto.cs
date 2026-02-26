namespace FoodRescue.BLL.Contract.VendorDashboard;

public class ExpiringProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public int Stock { get; set; }
    public DateTime ExpiresAt { get; set; }
    public string TimeRemaining { get; set; } = null!;
    public bool IsUrgent { get; set; }
}
