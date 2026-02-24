using FoodRescue.DAL.Consts;

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
    // Status of the product represented as an enum
    // New products are created as listings (Pending) and become products when Approved by an admin
    public ProductStatus Status { get; set; } = ProductStatus.Pending;
    public bool Expired { get; set; }       
    public DateTime ExpiryDate { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation
    public Vendor Vendor { get; set; } = null!;
    public ICollection<Review> Reviews { get; set; } = new List<Review>();

    // 🔴 NEW: One-to-Many relationship (Product can be in many Orders)
    public ICollection<Order> Orders { get; set; } = new List<Order>();

    // One-to-One relationship with AI spoilage detection result
    public AISpoileRequest? AISpoileRequest { get; set; }
}


        