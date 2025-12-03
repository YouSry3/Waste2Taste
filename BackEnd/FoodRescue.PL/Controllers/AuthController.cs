using FoodRescue.BLL.Contract.Authentication.Login;
using FoodRescue.BLL.Contract.Authentication.Register;
using FoodRescue.BLL.Services.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodRescue.PL.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        private readonly IAuthService AuthService = authService;

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request,
            CancellationToken cancellationToken)
        {
            var result = await AuthService.RegisterAsync(request, cancellationToken);
            return result.IsSuccess ?
                 Ok(result.Value):
                 BadRequest(result.Error);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request,
            CancellationToken cancellationToken)
        {
            var result = await AuthService.LoginAsync(request, cancellationToken);
            return result.IsSuccess ?
                 Ok(result.Value):
                 BadRequest(result.Error);
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            // Token invalidation would be handled by client (token is removed from localStorage)
            // Backend can optionally implement token blacklist for advanced scenarios
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpPost("Forget-Password")]
        public async Task<IActionResult> SendPasswordResetCode([FromQuery] string email,
            CancellationToken cancellationToken)
        [HttpPost("refresh-token")]
        [Authorize]
        public async Task<IActionResult> RefreshToken(CancellationToken cancellationToken)
        {
            // For now, re-validate the current token and return new token with extended expiry
            // In production, implement refresh token pattern with separate refresh tokens
            
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var emailClaim = User.FindFirst(ClaimTypes.Email)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || string.IsNullOrEmpty(emailClaim))
            {
                return Unauthorized(new { code = "InvalidToken", description = "Invalid or expired token" });
            }

            // In a real scenario, you would fetch the user from DB and regenerate token
            // For now, we'll return a simple response indicating token refresh is not fully implemented
            return StatusCode(501, new { code = "NotImplemented", description = "Token refresh not yet implemented" });
        }

        [HttpGet("verify-token")]
        [Authorize]
        public IActionResult VerifyToken()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var name = User.FindFirst(ClaimTypes.GivenName)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { isValid = false });
            }

            return Ok(new
            {
                isValid = true,
                user = new
                {
                    id = userId,
                    email = email,
                    name = name
                }
            });
        }
    }
}

