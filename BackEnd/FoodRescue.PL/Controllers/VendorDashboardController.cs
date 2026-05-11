using FoodRescue.BLL.Contract.VendorDashboard;
using FoodRescue.BLL.Extensions.Vendors; // Add this
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
    private readonly IVendorRepository _vendorRepo; // Add this

    public VendorDashboardController(
        IVendorDashboardService dashboardService,
        IVendorRepository vendorRepo) // Add this
    {
        _dashboardService = dashboardService;
        _vendorRepo = vendorRepo;
    }

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview()
    {
        var vendorId = await GetCurrentVendorIdAsync(); // Changed to async
        if (vendorId == Guid.Empty)
            return Unauthorized();

        var result = await _dashboardService.GetDashboardAsync(vendorId);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return Ok(result.Value);
    }

    // FIXED: Lookup VendorId by OwnerId (UserId from JWT)
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