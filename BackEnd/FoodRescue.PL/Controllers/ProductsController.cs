using FoodRescue.BLL.Contract.Products;
using FoodRescue.BLL.Services.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodRescue.PL.Controllers;

[ApiController]
[Route("products")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IProductService _service;

    public ProductsController(IProductService service)
    {
        _service = service;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] string? name)
    {
        var result = await _service.GetAllAsync(name);
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
}
