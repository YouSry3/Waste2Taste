namespace FoodRescue.BLL.Contract.Vendors;

public class VendorDetailsResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid OwnerId { get; set; }
    public string Address { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public List<VendorProductResponse> Products { get; set; } = new();
}
