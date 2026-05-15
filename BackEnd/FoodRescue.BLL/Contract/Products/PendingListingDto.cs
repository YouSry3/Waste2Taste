namespace FoodRescue.BLL.Contract.Products;
public class PendingListingDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string ImageUrl { get; set; } = null!;
    public decimal Price { get; set; }
    public decimal OriginalPrice { get; set; }
    public int Quantity { get; set; }
    public DateTime ExpiryDate { get; set; }
    public string? Category { get; set; }
    public Guid VendorId { get; set; }
    public string VendorName { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public string? AIPrediction { get; set; }
    public decimal? AIConfidence { get; set; }
    public int? AISpoiledPercentage { get; set; }
    public bool? AIIsSpoiled { get; set; }
}
