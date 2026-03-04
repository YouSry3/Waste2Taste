namespace FoodRescue.BLL.Contract.AnalyticsDashboardTabDTOs;
public class SalesByTypeDto
{
    public List<string> Labels { get; set; } = new();
    public List<int> Data { get; set; } = new();
    public List<decimal> Amounts { get; set; } = new();
}
