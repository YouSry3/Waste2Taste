namespace FoodRescue.DAL.Models;

public class SalesByTypeData
{
    public List<string> Categories { get; set; } = new();
    public List<decimal> Amounts { get; set; } = new();
    public List<int> Percentages { get; set; } = new();
}
