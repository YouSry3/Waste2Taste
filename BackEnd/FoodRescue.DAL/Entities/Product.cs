namespace FoodRescue.DAL.Entities;

public class Product
{
    public Guid Id { get; set; }
    public Guid VendorId { get; set; }
    public string Name { get; set; } = null!;
    public decimal Price { get; set; }
    public decimal Discount { get; set; }

    public int Quantity { get; set; }
    public bool Expired { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation
    public Vendor Vendor { get; set; } = null!;
    public ICollection<Order> Orders { get; set; } = new List<Order>();

    public ICollection<Review> Reviews { get; set; }

}
