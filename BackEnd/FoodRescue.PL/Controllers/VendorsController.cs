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
    [HttpGet("vendor")]
    public async Task<IActionResult> GetById([FromHeader]Guid id)
    {
        var result = await _vendorService.GetVendorByIdAsync(id);
         return
            result.IsSuccess ? Ok(result.Value) : NotFound(result.Error);
            
    }



    // POST /vendors — Admin only
    [HttpPost("create")]
    [Authorize(Roles = "admin")]
    //[Authorize]
    public async Task<IActionResult> Create([FromBody]CreateVendorRequest dto)
    {
        var result = await _vendorService.CreateVendorAsync(dto);

        return result.IsSuccess? 
              Ok(new { Id = result.Value })
            : Unauthorized(result.Error);
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
    [HttpDelete()]
    public async Task<IActionResult> Delete([FromHeader]Guid id)
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
