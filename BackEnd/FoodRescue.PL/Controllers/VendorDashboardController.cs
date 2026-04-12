using FoodRescue.BLL.Contract.VendorDashboard;
using FoodRescue.BLL.ServicesWeb.VendorDashboard;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodRescue.PL.Controllers;

[ApiController]
[ProducesResponseType(typeof(VendorDashboardResponse), 200)]
[Route("api/dashboard")]
[Authorize(Roles = "vendor")]
public class VendorDashboardController : ControllerBase
{
    private readonly IVendorDashboardService _dashboardService;

    public VendorDashboardController(IVendorDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("overview")]
    [Authorize(Roles ="admin")]
    public async Task<IActionResult> GetOverview()
    {
        var vendorId = GetCurrentVendorId();
        if (vendorId == Guid.Empty)
            return Unauthorized();

        var result = await _dashboardService.GetDashboardAsync(vendorId);

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
