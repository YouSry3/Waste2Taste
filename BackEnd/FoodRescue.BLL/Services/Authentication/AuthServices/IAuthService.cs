using FoodRescue.BLL.ResultPattern;
using FoodRescue.BLL.Contract.Authentication.ForgetPassword.CheckCode;
using FoodRescue.BLL.Contract.Authentication.ForgetPassword.UpdatePassword;
using FoodRescue.BLL.Contract.Authentication.Login;
using FoodRescue.BLL.Contract.Authentication.Register;


namespace FoodRescue.BLL.Services.Authentication.AuthServices
{
    public interface IAuthService
    {
        Task<Result<LoginResponse>> LoginAsync(LoginRequest model, CancellationToken cancellationToken = default);
        Task<Result<RegisterResponse>> RegisterAsync(RegisterRequest model, CancellationToken cancellationToken = default);
        Task<Result> SendPasswordResetCode(string email, CancellationToken cancellationToken = default);
        Task<Result> VerifyResetCode(VerifyResetCodeRequest Request, CancellationToken cancellationToken = default);
        Task<Result> ResetPassword(ForgetPasswordRequest Request, CancellationToken cancellationToken = default);

    }
}
