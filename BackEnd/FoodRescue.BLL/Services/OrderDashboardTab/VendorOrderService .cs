using FoodRescue.BLL.Contract.OrderDashboardTabDTOs;
using FoodRescue.BLL.Extensions.Dashboard.OrderDashboardTab;
using FoodRescue.DAL.Entities;
using FoodRescue.DAL.Models;

namespace FoodRescue.BLL.Services.OrderDashboardTab;

public class VendorOrderService : IVendorOrderService
{
    private readonly IVendorOrderRepository _repository;

    public VendorOrderService(IVendorOrderRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<VendorOrderListResponse>> GetOrdersAsync(Guid vendorId, OrderFilter filter)
    {
        var orders = await _repository.GetVendorOrdersAsync(vendorId, filter);
        var stats = await _repository.GetOrderStatsAsync(vendorId);

        var response = new VendorOrderListResponse
        {
            Orders = orders.Select(o => MapToDto(o)).ToList(),
            Stats = new OrderStatsDto
            {
                TotalRevenue = stats.TotalRevenue,
                ReadyForPickup = stats.ReadyForPickupCount,
                PendingPickup = stats.PendingPickupCount,
                AverageOrderValue = Math.Round(stats.AverageOrderValue, 2)
            }
        };

        return Result.Success(response);
    }

    public async Task<Result<VendorOrderDto?>> GetOrderByIdAsync(Guid orderId, Guid vendorId)
    {
        var order = await _repository.GetOrderByIdAsync(orderId, vendorId);

        if (order == null)
            return Result.Success<VendorOrderDto?>(null);

        return Result.Success<VendorOrderDto?>(MapToDto(order));
    }

    public async Task<Result<bool>> UpdateOrderStatusAsync(Guid orderId, Guid vendorId, string status)
    {
        var validStatuses = new[] { "Pending", "In Progress", "Ready for Pickup",
                                   "Picked Up", "Completed", "Cancelled" };

        if (!validStatuses.Contains(status))
            return Result.Failure<bool>(new Error("InvalidStatus", "Invalid order status"));

        var result = await _repository.UpdateOrderStatusAsync(orderId, vendorId, status);
        return Result.Success(result);
    }

    private static VendorOrderDto MapToDto(Order o)
    {
        var pickupTime = o.PickupTime;
        var timeRange = $"{pickupTime.AddMinutes(-30):h:mm tt} - {pickupTime.AddMinutes(30):h:mm tt}";

        return new VendorOrderDto
        {
            OrderId = $"ORD-{o.Id.ToString()[..8].ToUpper()}",
            Status = o.Status,
            OrderDate = o.CreatedAt,
            PickupTime = pickupTime.ToString("h:mm tt"),
            PickupTimeRange = timeRange,
            Customer = new CustomerInfoDto
            {
                Name = o.Customer?.Name ?? "Unknown",
                Phone = o.Customer?.PhoneNumber
            },
            Vendor = new VendorInfoDto
            {
                BusinessName = o.Product?.Vendor?.Name ?? "Unknown",
                Phone = o.Product?.Vendor?.PhoneNumber,
                Address = o.Product?.Vendor?.Address ?? "Unknown"
            },
            Product = new ProductInfoDto
            {
                Name = o.Product?.Name ?? "Unknown",
                SpecialInstructions = "Leave at front desk"
            },
            PickupLocation = o.Product?.Vendor?.Address ?? "Not specified",
            TotalPrice = o.TotalPrice,
            PaymentMethod = "Cash"
        };
    }
}
