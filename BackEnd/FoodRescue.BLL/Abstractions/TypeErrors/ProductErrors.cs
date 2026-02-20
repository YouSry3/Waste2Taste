using Microsoft.AspNetCore.Http;

namespace FoodRescue.BLL.Abstractions.TypeErrors;

public static class ProductErrors
{
    public static Error NotFound => new("Product.NotFound", "Product not found.");
    public static Error VendorNotFound => new("Product.VendorNotFound", "Vendor not found or not approved.");
    public static Error InvalidQuantity => new("Product.InvalidQuantity", "Quantity cannot be negative.");
    public static Error InvalidPrice => new("Product.InvalidPrice", "Price must be greater than 0.");
    public static Error InvalidExpiryDate => new("Product.InvalidExpiryDate", "Expiry date must be in the future.");
    public static Error InvalidImage => new("Product.InvalidImage", "Invalid image file.");
    // 🔴 ADD THIS:
    public static Error InvalidDiscount => new("Product.InvalidDiscount", "Discount percentage cannot exceed 100%.");
    public static Error UnvalidStatus => new("Product.UnvalidStatus", "this status must be 'approved'");
}
