namespace FoodRescue.DAL.Models;

public class ListingFilter
{
    public string? SearchTerm { get; set; }
    public string? Category { get; set; }
    public string? Status { get; set; } // "Active", "Sold Out", "All"
}
