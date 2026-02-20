namespace FoodRescue.DAL.Entities;

public class Vendor
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid OwnerId { get; set; }
    public string Address { get; set; } = string.Empty;
    public string Status { get; set; } = "active";
    public DateTime CreatedAt { get; set; }
    public string? PhoneNumber { get; set; } // added for dashboard

    // Navigation
    public User Owner { get; set; } = null!;
    public List<Product> Products { get; set; } = new();
}
