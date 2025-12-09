namespace FoodRescue.DAL.Entities;

public class Vendor
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid OwnerId { get; set; }
    public string Address { get; set; } = string.Empty;
    public string Status { get; set; } = "active";
    public DateTime CreatedAt { get; set; }

    // Navigation
    public User Owner { get; set; } = null!;
    public ICollection<Product> Products { get; set; }
    public ICollection<Order> Orders { get; set; }
    public ICollection<Donation> Donations { get; set; }
    //public List<Product> Products { get; set; } = new();
}
