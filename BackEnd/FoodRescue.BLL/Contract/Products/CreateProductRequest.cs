using Microsoft.AspNetCore.Http;

namespace FoodRescue.BLL.Contract.Products;

public class CreateProductRequest
{
    public Guid VendorId { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public decimal Price { get; set; }
    public decimal OriginalPrice { get; set; }
    public int Quantity { get; set; }
    public DateTime ExpiryDate { get; set; }
    public IFormFile ImageFile { get; set; } = null!;
}
