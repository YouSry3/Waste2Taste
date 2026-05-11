using FoodRescue.BLL.Contract.OrderDashboardTabDTOs;
using FoodRescue.BLL.Extensions.Vendors; // Add this
using FoodRescue.BLL.Services.OrderDashboardTab;
using FoodRescue.DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodRescue.PL.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize(Roles = "vendor")]
public class VendorOrdersController : ControllerBase
{
    private readonly IVendorOrderService _orderService;
    private readonly IVendorRepository _vendorRepo; // Add this

    public VendorOrdersController(
        IVendorOrderService orderService,
        IVendorRepository vendorRepo) // Add this
    {
        _orderService = orderService;
        _vendorRepo = vendorRepo;
    }

    [HttpGet("orders")]
    [ProducesResponseType(typeof(VendorOrderListResponse), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetOrders(
        [FromQuery] string? search,
        [FromQuery] string? status,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate,
        [FromQuery] string sortBy = "NewestFirst")
    {
        var vendorId = await GetCurrentVendorIdAsync();

        var filter = new OrderFilter
        {
            SearchTerm = search,
            Status = status,
            MinPrice = minPrice,
            MaxPrice = maxPrice,
            FromDate = fromDate,
            ToDate = toDate,
            SortBy = sortBy
        };

        var result = await _orderService.GetOrdersAsync(vendorId, filter);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return Ok(result.Value);
    }

    [HttpGet("orders/{orderId:guid}")]
    [ProducesResponseType(typeof(VendorOrderDto), 200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetOrderById(Guid orderId)
    {
        var vendorId = await GetCurrentVendorIdAsync();
        var result = await _orderService.GetOrderByIdAsync(orderId, vendorId);

        if (result.IsFailure)
            return BadRequest(result.Error);

        if (result.Value == null)
            return NotFound();

        return Ok(result.Value);
    }

    [HttpPatch("orders/{orderId:guid}/status")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> UpdateStatus(Guid orderId, [FromBody] UpdateOrderStatusRequest request)
    {
        var vendorId = await GetCurrentVendorIdAsync();
        var result = await _orderService.UpdateOrderStatusAsync(orderId, vendorId, request.Status);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return Ok(new { success = result.Value });
    }

    private async Task<Guid> GetCurrentVendorIdAsync()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                       ?? User.FindFirst("sub")?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
            return Guid.Empty;

        var vendor = await _vendorRepo.GetByOwnerIdAsync(userId);
        return vendor?.Id ?? Guid.Empty;
    }
}