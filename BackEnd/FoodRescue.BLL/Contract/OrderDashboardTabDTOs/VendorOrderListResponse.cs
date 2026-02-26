namespace FoodRescue.BLL.Contract.OrderDashboardTabDTOs;

public class VendorOrderListResponse
{
    public List<VendorOrderDto> Orders { get; set; } = new();
    public OrderStatsDto Stats { get; set; } = null!;
}