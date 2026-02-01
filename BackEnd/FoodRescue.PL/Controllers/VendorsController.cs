using FoodRescue.BLL.Contract.Vendors;
using FoodRescue.BLL.Services.Vendors;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodRescue.PL.Controllers;
[ApiController]
[Route("vendors")]
public class VendorsController : ControllerBase
{
    private readonly IVendorService _vendorService;

    public VendorsController(IVendorService vendorService)
    {
        _vendorService = vendorService;
    }


    // GET /vendors
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? name, [FromQuery] string? status)
    {
        var result = await _vendorService.GetVendorsAsync(name, status);
        return Ok(result);
    }


    // GET /vendors/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var vendor = await _vendorService.GetVendorByIdAsync(id);
        if (vendor == null) return NotFound(new { message = "Vendor not found" });

        return Ok(vendor);
    }



    // POST /vendors — Admin only
    [HttpPost]
    [Authorize(Roles = "admin")]
    //[Authorize]
    public async Task<IActionResult> Create(CreateVendorRequest dto)
    {
        var id = await _vendorService.CreateVendorAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }




    // PUT /vendors/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateVendorRequest dto)
    {
        var result = await _vendorService.UpdateVendorAsync(id, dto);

        if (result.IsFailure)
            return NotFound(new { code = result.Error!.code, message = result.Error.description });

        return Ok(new { message = "Vendor updated successfully" });
    }



    // DELETE /vendors/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _vendorService.DeleteVendorAsync(id);

        if (result.IsFailure)
            return NotFound(new { code = result.Error!.code, message = result.Error.description });

        return Ok(new { message = "Vendor deleted successfully" });
    }




    // GET /vendors/{id}/products
    [HttpGet("{id:guid}/products")]
    public async Task<IActionResult> GetProducts(Guid id)
    {
        var products = await _vendorService.GetVendorProductsAsync(id);
        return Ok(products);
    }
}
