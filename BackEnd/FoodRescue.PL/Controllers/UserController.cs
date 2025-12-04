using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.DTOs;
using FoodRescue.BLL.Services.UserServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FoodRescue.PL.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;

        public UserController(IUserService service)
        {
            _service = service;
        }
        // GET /users/profile
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile([FromHeader] string email)
        {

            var result = await _service.GetProfileAsync(email);
            if (result.IsSuccess) return NotFound(result.Error);

            return Ok(result.Value);
        }
     

        // PUT /users/profile
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(
            [FromHeader] string email,
            [FromBody] UpdateProfileDTO dto)
        {
             var result = await _service.UpdateProfileAsync(email, dto);
            if (result.IsFailure) 
                return NotFound(result.Error); 

            return Ok(new { message = "Profile updated successfully" });
        }


        // GET /users/vendors
        [HttpGet("vendors")]
        public async Task<IActionResult> GetVendors()
        {
            var vendors = await _service.GetVendorsAsync();
            return Ok(vendors);
        }


        // GET /users/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var user = await _service.GetByIdAsync(id);
            return user.IsSuccess
                ? Ok(user.Value)
                : NotFound(user.Error);
        }
    }
}
