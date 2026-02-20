namespace FoodRescue.DAL.Entities;

public class Product
{
    public Guid Id { get; set; }
    public Guid VendorId { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string? Category { get; set; }
    public string ImageUrl { get; set; } = null!;
    public decimal Price { get; set; }
    public decimal OriginalPrice { get; set; }
    public int Quantity { get; set; }
    public bool Expired { get; set; }
    public DateTime ExpiryDate { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation
    public Vendor Vendor { get; set; } = null!;
    public ICollection<Review> Reviews { get; set; } = new List<Review>();

    // 🔴 NEW: One-to-Many relationship (Product can be in many Orders)
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
