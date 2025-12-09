namespace FoodRescue.BLL.Abstractions.TypeErrors;

public static class VendorErrors
{
    public static Error NotFound => new("Vendor.NotFound", "The vendor was not found.");
    public static Error InvalidId => new("Vendor.InvalidId", "The vendor ID is invalid.");
    public static Error NameRequired => new("Vendor.NameRequired", "Vendor name is required.");
}

