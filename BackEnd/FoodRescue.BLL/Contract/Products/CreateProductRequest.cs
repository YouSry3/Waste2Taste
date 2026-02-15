namespace FoodRescue.BLL.Contract.Products;

public class CreateProductRequest
{
    public Guid VendorId { get; set; }
    public string Name { get; set; } = null!;
    public decimal Price { get; set; }
    public decimal Discount { get; set; }
    public int Quantity { get; set; }
}
