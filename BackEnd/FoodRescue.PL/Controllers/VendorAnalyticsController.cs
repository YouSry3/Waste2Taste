using FoodRescue.BLL.Contract.AnalyticsDashboardTabDTOs;
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

    public VendorAnalyticsController(IVendorAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    [HttpGet("analytics")]
    [ProducesResponseType(typeof(VendorAnalyticsResponse), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetAnalytics([FromQuery] string period = "month")
    {
        var vendorId = GetCurrentVendorId();
        var result = await _analyticsService.GetAnalyticsAsync(vendorId, period);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return Ok(result.Value);
    }

    private Guid GetCurrentVendorId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }
}
