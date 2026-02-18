namespace FoodRescue.BLL.Contract.Products;

public class ProductDetailResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;
    public decimal Price { get; set; }
    public decimal OriginalPrice { get; set; }
    public int DiscountPercentage { get; set; }
    public string ExpiresIn { get; set; } = null!;
    public double Rating { get; set; }
    public int ReviewCount { get; set; }
    public string VendorName { get; set; } = null!;
    public Guid VendorId { get; set; }
    public int Quantity { get; set; }
    public bool Expired { get; set; }
    public DateTime ExpiryDate { get; set; }
}
