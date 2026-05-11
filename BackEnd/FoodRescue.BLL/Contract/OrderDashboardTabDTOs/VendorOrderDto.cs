namespace FoodRescue.BLL.Contract.OrderDashboardTabDTOs;

public class VendorOrderDto
{
    public Guid Id { get; set; }              //  Raw GUID for API calls
    public string OrderId { get; set; } = null!;  // Formatted "ORD-XXXX" for display
    public string Status { get; set; } = null!;
    public DateTime OrderDate { get; set; }
    public string PickupTime { get; set; } = null!;
    public string PickupTimeRange { get; set; } = null!;
    public CustomerInfoDto Customer { get; set; } = null!;
    public VendorInfoDto Vendor { get; set; } = null!;
    public ProductInfoDto Product { get; set; } = null!;
    public string PickupLocation { get; set; } = null!;
    public decimal TotalPrice { get; set; }
    public string PaymentMethod { get; set; } = "Cash";
}
