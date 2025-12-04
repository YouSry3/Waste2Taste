namespace FoodRescue.BLL.Contract.Vendors;

public class VendorProductResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public bool Expired { get; set; }
}