using FoodRescue.DAL.Consts;



namespace FoodRescue.DAL.Entities;

public class Vendor
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid OwnerId { get; set; }
    public string Address { get; set; } = string.Empty;
    public VendorCategory Category { get; set; }
    //public string Status { get; set; } = "active";
    // For Simplicity, vendor status is determined by the presence of a VendorRequest with "approved" status. If no approved request exists, vendor is considered "pending".
    // and EG
    public string Role { get; set; } = "vendor";
    public DateTime CreatedAt { get; set; }
    public string? PhoneNumber { get; set; } // added for dashboard

    // Navigation
    public User Owner { get; set; } = null!;
    public List<Product> Products { get; set; } = new();
}
