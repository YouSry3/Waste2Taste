namespace FoodRescue.BLL.Contract.Vendors;

public class VendorListResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
