using FoodRescue.BLL.Contract.Authentication.ForgetPassword.CheckCode;
using FoodRescue.BLL.Contract.Authentication.ForgetPassword.SendForgetEmail;
using FoodRescue.BLL.Contract.Authentication.ForgetPassword.UpdatePassword;
using FoodRescue.BLL.Contract.Authentication.Login;
using FoodRescue.BLL.Contract.Authentication.Register;
using FoodRescue.BLL.Services.Authentication.AuthServices;
using FoodRescue.BLL.Services.Authentication.Email_Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodRescue.PL.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService, EmailService email) : ControllerBase
    {
        private readonly IAuthService AuthService = authService;

        private readonly EmailService _emailService = email;



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

        [HttpPost("password-reset-code")]
        public async Task<IActionResult> SendPasswordResetCode([FromBody] SendEmailRequest request, CancellationToken cancellationToken)
        {
            var result = await AuthService.SendPasswordResetCode(request.Email, cancellationToken);
            return result.IsSuccess ?
                Ok() :
                BadRequest(result.Error);
        }
        // Explain this code line by line. For each line infer what it wants to achieve and how it fits into the big picture.
        [HttpPost("verify-reset-code")]
        public async Task<IActionResult> VerifyResetCode([FromBody] VerifyResetCodeRequest request, CancellationToken cancellationToken)
        {
            var result = await AuthService.VerifyResetCode(request, cancellationToken);
            return result.IsSuccess ?
                Ok(new { message = "Code is valid." }) :
                BadRequest(new { error = result.Error });
        }
        // Explain this code line by line. For each line infer what it wants to achieve and how it fits into the big picture.
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ForgetPasswordRequest request, CancellationToken cancellationToken)
        {
            var result = await AuthService.ResetPassword(request, cancellationToken);
            return result.IsSuccess ?
                Ok(new { message = "Password has been reset successfully." }) :
                BadRequest(result.Error);
        }


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

        
    }
}

