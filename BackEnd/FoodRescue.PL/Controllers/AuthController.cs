using FoodRescue.BLL.Contract.Authentication.ForgetPassword.CheckCode;
using FoodRescue.BLL.Contract.Authentication.ForgetPassword.SendForgetEmail;
using FoodRescue.BLL.Contract.Authentication.ForgetPassword.UpdatePassword;
using FoodRescue.BLL.Contract.Authentication.Login;
using FoodRescue.BLL.Contract.Authentication.RefreshToken;
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
        
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request, CancellationToken cancellationToken)
        {
            // give id from the token to make sure the user is the same as the one who logged in
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await AuthService.RefreshTokenAsync(request, Guid.Parse(userId!), cancellationToken);

            if (!result.IsSuccess)
                return Unauthorized(result.Error);

            return Ok(result.Value);
        }


    }
}

