using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Contract.DTOs;
using FoodRescue.BLL.Services.UserServices;
using FoodRescue.BLL.Services.Vendors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FoodRescue.PL.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;
        private readonly IVendorService _vendorService;


        public UserController(IUserService service, IVendorService vendorService)
        {
            _service = service;
            _vendorService = vendorService;
        }
        // GET /users/profile
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile([FromHeader] string email)
        {

            var result = await _service.GetProfileAsync(email);
            if (result.IsSuccess) return NotFound(result.Error);

            return Ok(result.Value);
        }


        ////in case of image upload ( img from front => URL or Base64)
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
        /*  //in case of image upload (real img => IFormFile)
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(
    [FromHeader] string email,
    [FromForm] IFormFile? image,
    [FromForm] string name,
    [FromForm] string type)
        {
            string? imagePath = null;

            if (image != null)
            {
                var fileName = $"{Guid.NewGuid()}_{image.FileName}";
                var path = Path.Combine("wwwroot/images/users", fileName);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                imagePath = $"/images/users/{fileName}";
            }

            var dto = new UpdateProfileDTO
            {
                Name = name,
                Type = type,
                ProfileImage = imagePath
            };

            var result = await _service.UpdateProfileAsync(email, dto);

            if (result.IsFailure)
                return NotFound(result.Error);

            return Ok(new { message = "Profile updated successfully" });
        }

        */

        // GET /users/vendors
        [HttpGet("vendors")]
        public async Task<IActionResult> GetVendors(
            [FromQuery] string? name,
            [FromQuery] string? status)
        {
            var vendors = await _vendorService.GetVendorsAsync(name, status);
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

        [HttpGet("profile/stats")]
        public async Task<IActionResult> GetUserStats([FromHeader] string email)
        {
            var result = await _service.GetUserStatsAsync(email);

            if (result.IsFailure)
                return NotFound(result.Error);

            return Ok(new { message = "User stats retrieved successfully", stats = result.Value });
        }




    }
}
