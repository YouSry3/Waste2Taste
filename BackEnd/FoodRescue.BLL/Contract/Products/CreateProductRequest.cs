namespace FoodRescue.BLL.Contract.Products;

public class CreateProductRequest
{
    public Guid VendorId { get; set; }
    public string Name { get; set; } = null!;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public bool Expired { get; set; }
}
