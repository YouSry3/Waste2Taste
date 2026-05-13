using FoodRescue.BLL.Contract.HelpAndSupport;
using FoodRescue.BLL.Services.Support;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodRescue.PL.Controllers
{
    [ApiController]
    [Route("support")]
    [Authorize]
    public class SupportController : ControllerBase
    {
        private readonly SupportService _supportService;

        public SupportController(SupportService supportService)
        {
            _supportService = supportService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendSupport([FromBody] SupportRequestDto request)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdString, out var userId))
            {
                return BadRequest(new { message = "Invalid user identifier." });
            }

            await _supportService.SendSupportRequestAsync(
                request.Subject,
                request.Description,
                userId
            );

            return Ok(new
            {
                message = "Support request sent successfully"
            });
        }
    }
}