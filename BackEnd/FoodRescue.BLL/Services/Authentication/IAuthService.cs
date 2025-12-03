using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Contract.Authentication.Login;
using FoodRescue.BLL.Contract.Authentication.Register;


namespace FoodRescue.BLL.Services.Authentication
{
    public interface IAuthService
    {
        Task<Result<LoginResponse>> LoginAsync(LoginRequest model, CancellationToken cancellationToken = default);
        Task<Result<RegisterResponse>> RegisterAsync(RegisterRequest model, CancellationToken cancellationToken = default);
        Task<Result> SendPasswordResetCode(string email, CancellationToken cancellationToken = default);

    }
}
