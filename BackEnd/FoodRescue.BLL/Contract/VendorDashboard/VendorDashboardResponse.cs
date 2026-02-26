namespace FoodRescue.BLL.Contract.VendorDashboard;

public class VendorDashboardResponse
{
    public VendorDashboardStatsResponse Stats { get; set; } = null!;
    public MonthlyGoalsDto MonthlyGoals { get; set; } = null!;
    public List<ExpiringProductDto> ExpiringSoon { get; set; } = new();
    public List<RecentOrderDto> RecentOrders { get; set; } = new();
    public List<TopCustomerDto> TopCustomers { get; set; } = new();
    public EnvironmentalImpactDto EnvironmentalImpact { get; set; } = null!;
}
