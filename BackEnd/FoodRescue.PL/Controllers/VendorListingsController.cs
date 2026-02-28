using FoodRescue.BLL.Contract.ListingDashboardDTOs;
using FoodRescue.BLL.Services.ListingDashboardTab;
using FoodRescue.DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodRescue.PL.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize(Roles = "vendor")]
public class VendorListingsDashboardController : ControllerBase
{
    private readonly IVendorListingService _listingService;

    public VendorListingsDashboardController(IVendorListingService listingService)
    {
        _listingService = listingService;
    }

    [HttpGet("listings")]
    [ProducesResponseType(typeof(VendorListingListResponse), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetListings(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] string? status)
    {
        var vendorId = GetCurrentVendorId();

        var filter = new ListingFilter
        {
            SearchTerm = search,
            Category = category,
            Status = status
        };

        var result = await _listingService.GetListingsAsync(vendorId, filter);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return Ok(result.Value);
    }

    [HttpGet("listings/{productId:guid}")]
    [ProducesResponseType(typeof(VendorListingDto), 200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetListingById(Guid productId)
    {
        var vendorId = GetCurrentVendorId();
        var result = await _listingService.GetListingByIdAsync(productId, vendorId);

        if (result.IsFailure)
            return BadRequest(result.Error);

        if (result.Value == null)
            return NotFound();

        return Ok(result.Value);
    }

    [HttpPut("listings/{productId:guid}")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> UpdateListing(Guid productId, [FromBody] UpdateListingRequest request)
    {
        var vendorId = GetCurrentVendorId();
        var result = await _listingService.UpdateListingAsync(productId, vendorId, request);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return Ok(new { success = result.Value });
    }

    [HttpDelete("listings/{productId:guid}")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> DeleteListing(Guid productId)
    {
        var vendorId = GetCurrentVendorId();
        var result = await _listingService.DeleteListingAsync(productId, vendorId);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return Ok(new { success = result.Value });
    }

    private Guid GetCurrentVendorId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }
}
