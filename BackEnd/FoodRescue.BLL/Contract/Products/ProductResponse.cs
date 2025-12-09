namespace FoodRescue.BLL.Contract.Products;

public class ProductResponse
{
    public Guid Id { get; set; }
    public Guid VendorId { get; set; }
    public string Name { get; set; } = null!;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public bool Expired { get; set; }
    public DateTime CreatedAt { get; set; }
}
