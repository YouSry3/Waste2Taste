using FoodRescue.BLL.Contract.Products;
using FoodRescue.BLL.Services.Products;
using FoodRescue.BLL.Services.Favorites;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodRescue.PL.Controllers;

[ApiController]
[Route("products")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IProductService _service;
    private readonly IFavoriteService _favoriteService;

    public ProductsController(IProductService service, IFavoriteService favoriteService)
    {
        _service = service;
        _favoriteService = favoriteService;
    }

    /// <summary>
    /// Get all products with optional name filter
    /// </summary>
    /// <remarks>
    /// Returns a list of all active products with their details including category, 
    /// vendor information, pricing, and location data. Includes IsFavorite flag for authenticated users.
    /// </remarks>
    /// <param name="name">Optional product name filter</param>
    /// <returns>List of products with category information</returns>
    /// <response code="200">Products retrieved successfully with category data</response>
    /// <response code="400">Invalid request parameters</response>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IEnumerable<ProductListResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [Produces("application/json")]
    public async Task<IActionResult> GetAll([FromQuery] string? name)
    {
        // Try to get current user ID if authenticated
        Guid? userId = null;
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var parsedUserId))
        {
            userId = parsedUserId;
        }

        var result = await _service.GetAllAsync(name, userId);
        if (result.IsFailure) return BadRequest(result.Error);
        return Ok(result.Value);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result.IsFailure) return NotFound(result.Error);
        return Ok(result.Value);
    }

    [HttpGet("vendor/{vendorId:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByVendor(Guid vendorId)
    {
        var result = await _service.GetByVendorAsync(vendorId);
        if (result.IsFailure) return BadRequest(result.Error);
        return Ok(result.Value);
    }

    [HttpPost]
    [Authorize(Roles = "vendor")]
    public async Task<IActionResult> Create([FromForm] CreateProductRequest request)
    {
        var result = await _service.CreateAsync(request);
        if (result.IsFailure) return BadRequest(result.Error);
        return CreatedAtAction(nameof(GetById), new { id = result.Value }, new { id = result.Value });
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "vendor")]
    public async Task<IActionResult> Update(Guid id, [FromForm] UpdateProductRequest request)
    {
        var result = await _service.UpdateAsync(id, request);
        if (result.IsFailure) return NotFound(result.Error);
        return Ok(new { message = "Product updated successfully" });
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "vendor")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _service.DeleteAsync(id);
        if (result.IsFailure) return NotFound(result.Error);
        return Ok(new { message = "Product deleted successfully" });
    }

    [HttpPatch("{id:guid}/stock")]
    [Authorize(Roles = "vendor")]
    public async Task<IActionResult> UpdateStock(Guid id, [FromQuery] int quantity)
    {
        var result = await _service.UpdateStockAsync(id, quantity);
        if (result.IsFailure) return BadRequest(result.Error);
        return Ok(new { message = "Stock updated successfully" });
    }

    [HttpPatch("{id:guid}/expire")]
    [Authorize(Roles = "vendor")]
    public async Task<IActionResult> MarkAsExpired(Guid id)
    {
        var result = await _service.MarkAsExpiredAsync(id);
        if (result.IsFailure) return NotFound(result.Error);
        return Ok(new { message = "Product marked as expired" });
    }

    /// <summary>
    /// Toggle favorite status for a product
    /// </summary>
    /// <remarks>
    /// If the product is already favorited by the current user, it will be removed.
    /// If not favorited, it will be added to favorites.
    /// </remarks>
    /// <param name="productId">The product ID to toggle favorite</param>
    /// <returns>Message indicating if favorite was added or removed</returns>
    /// <response code="200">Favorite toggled successfully</response>
    /// <response code="401">Unauthorized - user not authenticated</response>
    /// <response code="404">Product not found</response>
    [HttpPost("{productId:guid}/favorite")]
    [Authorize(Roles ="customer")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ToggleFavorite(Guid productId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        var result = await _favoriteService.ToggleFavoriteAsync(userId, productId);
        if (result.IsFailure)
        {
            if (result.Error.code == "ProductNotFound")
                return NotFound(result.Error);
            return BadRequest(result.Error);
        }

        return Ok(new { message = result.Value });
    }

    /// <summary>
    /// Get all products favorited by the current user
    /// </summary>
    /// <remarks>
    /// Returns a list of all products that the current user has added to favorites.
    /// </remarks>
    /// <returns>List of favorited products</returns>
    /// <response code="200">Favorites retrieved successfully</response>
    /// <response code="401">Unauthorized - user not authenticated</response>
    [HttpGet("my-favorites")]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<ProductListResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [Produces("application/json")]
    public async Task<IActionResult> GetMyFavorites()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized(new { message = "User not authenticated" });
        }

        var result = await _favoriteService.GetUserFavoritesAsync(userId);
        if (result.IsFailure) return BadRequest(result.Error);
        return Ok(result.Value);
    }
}
