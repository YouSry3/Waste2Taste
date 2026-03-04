namespace FoodRescue.BLL.Contract.AnalyticsDashboardTabDTOs;
public class PeakHoursDto
{
    public List<string> Labels { get; set; } = new();
    public List<int> Data { get; set; } = new();
    public string PeakTime { get; set; } = null!;
    public int PeakOrders { get; set; }
}
