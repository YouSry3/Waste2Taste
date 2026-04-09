using FoodRescue.BLL.Contract.Products.Approval;
using FoodRescue.BLL.Services.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodRescue.PL.Controllers;

[Route("[controller]")]
[ApiController]
[Authorize]
public class ListingController : ControllerBase
{
    private readonly IListingApprovalService _listingApprovalService;

    public ListingController(IListingApprovalService listingApprovalService)
    {
        _listingApprovalService = listingApprovalService ?? throw new ArgumentNullException(nameof(listingApprovalService));
    }

    [HttpGet("pending")]
    [Authorize(Roles ="admin")]
    public async Task<IActionResult> GetPendingListings()
    {
        var result = await _listingApprovalService.GetAllPendingListingsAsync();

        if (result.IsFailure)
            return BadRequest(new { Error = result.Error! }); 

        return Ok(new { Data = result.Value });
    }

    [HttpGet("pending/{productId}")]
    public async Task<IActionResult> GetPendingListing(Guid productId)
    {
        var result = await _listingApprovalService.GetPendingListingAsync(productId);

        if (!result.IsSuccess)
            return NotFound(new { Error = result.Error.description });

        return Ok(new { Data = result.Value });
    }

    [HttpPost("approve")]
    public async Task<IActionResult> ApproveListing([FromHeader] Guid productId)
    {
        if (productId == Guid.Empty)
            return BadRequest(new { Error = "Product ID is required" });

        var result = await _listingApprovalService.ApproveListingAsync(productId);

        if (!result.IsSuccess)
            return BadRequest(new { Error = result.Error!.description });

        return Ok(new { Message = "Listing approved successfully", Data = new { ProductId = productId, Status = "Approved" } });
    }

    [HttpPost("reject")]
    public async Task<IActionResult> RejectListing([FromBody] ListingApprovalRequest request)
    {
        if (request == null || request.ProductId == Guid.Empty)
            return BadRequest(new { Error = "Product ID is required" });

        if (string.IsNullOrWhiteSpace(request.RejectionReason))
            return BadRequest(new { Error = "Rejection reason is required" });

        var result = await _listingApprovalService.RejectListingAsync(request.ProductId, request.RejectionReason);

        if (!result.IsSuccess)
            return BadRequest(new { Error = result.Error.description });

        return Ok(new { Message = "Listing rejected successfully", Data = new { ProductId = request.ProductId, Status = "Discontinued", RejectionReason = request.RejectionReason } });
    }
}

