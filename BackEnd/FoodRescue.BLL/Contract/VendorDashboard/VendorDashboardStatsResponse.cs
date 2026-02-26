namespace FoodRescue.BLL.Contract.VendorDashboard;

public class VendorDashboardStatsResponse
{
    public int ActiveListings { get; set; }
    public decimal Revenue30Days { get; set; }
    public int TotalOrders { get; set; }
    public double FoodSavedLbs { get; set; }
    public int PickupsToday { get; set; }
    public double AverageRating { get; set; }
}
