using FoodRescue.BLL.Contract.Authentication.Login;
using FoodRescue.BLL.Contract.Authentication.Register;
using FoodRescue.BLL.Services.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FoodRescue.PL.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        private readonly IAuthService AuthService = authService;
        // POST: /Auth/register Mohamed 
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
        public async Task<IActionResult> Login([FromBody]LoginRequest request,
            CancellationToken cancellationToken)
        {
            var result = await AuthService.LoginAsync(request, cancellationToken);
            return result.IsSuccess ?
                 Ok(result.Value):
                 BadRequest(result.Error);
        }


        [HttpPost("Forget-Password")]
        public async Task<IActionResult> SendPasswordResetCode([FromBody] string email,
            CancellationToken cancellationToken)
        {
            var result = await AuthService.SendPasswordResetCode(email, cancellationToken);
            return result.IsSuccess ?
                 Ok("Check Your Inbox Email"):
                 BadRequest(result.Error);
        }


    }
}
