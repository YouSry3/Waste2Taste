namespace FoodRescue.BLL.Contract.Vendors;

public class CreateVendorRequest
{
    public string Name { get; set; } = string.Empty;
    public Guid OwnerId { get; set; }
    public string Address { get; set; } = string.Empty;
    public string Status { get; set; } = "active";
}
