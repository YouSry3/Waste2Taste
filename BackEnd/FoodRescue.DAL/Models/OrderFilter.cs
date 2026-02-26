namespace FoodRescue.DAL.Models;

public class OrderFilter
{
    public string? SearchTerm { get; set; }
    public string? Status { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string SortBy { get; set; } = "NewestFirst";
}
