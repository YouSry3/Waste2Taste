using FoodRescue.BLL.Contract.Products;
using FoodRescue.BLL.Services.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodRescue.PL.Controllers;

[ApiController]
[Route("products")]

public class ProductsController : ControllerBase
{
    private readonly IProductService _service;

    public ProductsController(IProductService service)
    {
        _service = service;
    }

    // GET /products
    [HttpGet] // GET /products
    [Authorize(Roles = "vendor")]
    public async Task<IActionResult> GetAll(ProductRequest request)
    {
        var result = await _service.GetAllAsync(request.vendorId, request.expired);
        return Ok(result.Value);
    }

    // GET /products/{id}
    [HttpGet("{id:guid}")] // GET /products/{id}
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);

        if (result.IsFailure)
            return NotFound(result.Error);

        return Ok(result.Value);
    }

    // POST /products
    [HttpPost("Create")] // POST /products
    [Authorize(Roles = "vendor")]
    public async Task<IActionResult> Create(CreateProductRequest request)
    {

        var result = await _service.CreateAsync(request);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return CreatedAtAction(nameof(GetById), new { id = result.Value }, result.Value);
    }

    // PUT /products/{id}
    [HttpPut("{id:guid}")] // PUT /products/{id}
    [Authorize(Roles = "vendor")]
    public async Task<IActionResult> Update(Guid id, UpdateProductRequest request)
    {
        var result = await _service.UpdateAsync(id, request);

        if (result.IsFailure)
            return NotFound(result.Error);

        return Ok();
    }

    // DELETE /products/{id}
    [HttpDelete()] // DELETE /products/
    [Authorize(Roles = "vendor")]
    public async Task<IActionResult> Delete([FromHeader]Guid id)
    {
        var result = await _service.DeleteAsync(id);

        if (result.IsFailure)
            return NotFound(result.Error);

        return Ok(new { message = "Delete is Succcessfully!"});
    }

    // PATCH /products/{id}/stock
    [HttpPatch("{id:guid}/stock")] // PATCH /products/{id}/stock?quantity=10
    [Authorize(Roles = "vendor")]
    public async Task<IActionResult> UpdateStock(Guid id, [FromQuery] int quantity)
    {
        var result = await _service.UpdateStockAsync(id, quantity);

        if (result.IsFailure)
            return BadRequest(result.Error);

        return Ok();
    }
}
