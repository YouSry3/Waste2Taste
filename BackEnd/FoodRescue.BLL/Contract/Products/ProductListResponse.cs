namespace FoodRescue.BLL.Contract.Products;

public class ProductListResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;
    public decimal Price { get; set; }
    public string Descripcion { get; set; }
    public decimal OriginalPrice { get; set; }
    public int DiscountPercentage { get; set; }
    public string ExpiresIn { get; set; } = null!;
    public double Rating { get; set; }
    public int TotalReviews { get; set; }
    public Guid VendorId { get; set; }
    public string VendorName { get; set; } = null!;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? Category { get; set; }
    public bool IsFavorite { get; set; } = false;
}
