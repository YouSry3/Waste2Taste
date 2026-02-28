namespace FoodRescue.BLL.Contract.ListingDashboardDTOs;

public class VendorListingDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string? Category { get; set; }
    public string ImageUrl { get; set; } = null!;
    public decimal OriginalPrice { get; set; }
    public decimal SalePrice { get; set; }
    public int DiscountPercentage { get; set; }
    public int Quantity { get; set; }
    public string Status { get; set; } = null!; // "Active" or "Sold Out"
    public double Rating { get; set; }
    public string VendorName { get; set; } = null!;
    public string Location { get; set; } = null!;
    public string PickupTime { get; set; } = null!; // Calculated from ExpiryDate
}
