namespace FoodRescue.BLL.Abstractions.TypeErrors;

public static class ProductErrors
{
    //public static Error NotFound => new("Product.NotFound", "The product was not found.");
    //public static Error InvalidId => new("Product.InvalidId", "The product ID is invalid.");
    //public static Error NameRequired => new("Product.NameRequired", "Product name is required.");


    public static Error NotFound => new("Product.NotFound", "Product not found.");
    public static Error VendorNotFound => new("Product.VendorNotFound", "Vendor does not exist.");
    public static Error InvalidQuantity => new("Product.InvalidQuantity", "Quantity cannot be negative.");
    public static Error InvalidDiscount => new("Product.InvalidDiscount", "Discount cannot be 100%.");
}
