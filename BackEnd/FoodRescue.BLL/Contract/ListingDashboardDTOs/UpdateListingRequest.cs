namespace FoodRescue.BLL.Contract.ListingDashboardDTOs;

public class UpdateListingRequest
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public decimal OriginalPrice { get; set; }
    public decimal SalePrice { get; set; }
    public int Quantity { get; set; }
}
