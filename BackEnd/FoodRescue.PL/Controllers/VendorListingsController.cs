using FoodRescue.BLL.Contract.ListingDashboardDTOs;
using FoodRescue.BLL.Extensions.Vendors; // Add this
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
    private readonly IVendorRepository _vendorRepo; // Add this

    public VendorListingsDashboardController(
        IVendorListingService listingService,
        IVendorRepository vendorRepo) // Add this
    {
        _listingService = listingService;
        _vendorRepo = vendorRepo;
    }

    [HttpGet("listings")]
    [ProducesResponseType(typeof(VendorListingListResponse), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetListings(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] string? status)
    {
        var vendorId = await GetCurrentVendorIdAsync();

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
        var vendorId = await GetCurrentVendorIdAsync();
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
        var vendorId = await GetCurrentVendorIdAsync();
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
        var vendorId = await GetCurrentVendorIdAsync();
        var result = await _listingService.DeleteListingAsync(productId, vendorId);

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