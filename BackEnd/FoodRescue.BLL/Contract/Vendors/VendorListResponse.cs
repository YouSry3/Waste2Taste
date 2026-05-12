namespace FoodRescue.BLL.Contract.Vendors;

public class VendorListResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public bool IsBlocked { get; set; } // = !owner.IsActive
}
