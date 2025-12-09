namespace FoodRescue.BLL.Contract.Products;

public class UpdateProductRequest
{
    public string? Name { get; set; }
    public decimal? Price { get; set; }
    public int? Quantity { get; set; }
    public bool? Expired { get; set; }
}
