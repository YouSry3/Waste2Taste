using FoodRescue.BLL.Contract.AnalyticsDashboardTabDTOs;
using FoodRescue.BLL.Extensions.Vendors; // Add this
using FoodRescue.BLL.Services.AnalyticsDashboardTab;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodRescue.PL.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize(Roles = "vendor")]
public class VendorAnalyticsController : ControllerBase
{
    private readonly IVendorAnalyticsService _analyticsService;
    private readonly IVendorRepository _vendorRepo; // Add this

    public VendorAnalyticsController(
        IVendorAnalyticsService analyticsService,
        IVendorRepository vendorRepo) // Add this
    {
        _analyticsService = analyticsService;
        _vendorRepo = vendorRepo;
    }

    [HttpGet("analytics")]
    [ProducesResponseType(typeof(VendorAnalyticsResponse), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetAnalytics([FromQuery] string period = "month")
    {
        var vendorId = await GetCurrentVendorIdAsync();
        var result = await _analyticsService.GetAnalyticsAsync(vendorId, period);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return Ok(result.Value);
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