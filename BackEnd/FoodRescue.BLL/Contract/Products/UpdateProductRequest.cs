using Microsoft.AspNetCore.Http;

namespace FoodRescue.BLL.Contract.Products;

public class UpdateProductRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public int? Quantity { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public bool? Expired { get; set; }
    public IFormFile? ImageFile { get; set; }
}
