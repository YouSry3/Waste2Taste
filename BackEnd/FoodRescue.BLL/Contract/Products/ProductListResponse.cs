namespace FoodRescue.BLL.Contract.Products;

public class ProductListResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;
    public decimal Price { get; set; }
    public decimal OriginalPrice { get; set; }
    public int DiscountPercentage { get; set; }
    public string ExpiresIn { get; set; } = null!;
    public double Rating { get; set; }
    public string VendorName { get; set; } = null!;
}
