using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Abstractions.TypeErrors;
using FoodRescue.BLL.Contract.Authentication;
using FoodRescue.BLL.Contract.Authentication.Login;
using FoodRescue.BLL.Contract.Authentication.Register;
using FoodRescue.BLL.Extensions.Users;
using FoodRescue.BLL.Services.JWT;
using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using Mapster;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FoodRescue.BLL.Services.Authentication
{
    public class AuthService(
        IUserRepository userRepository,
        CompanyDbContext context,
        IJwtProvider tokenService,
        IEmailService emailService) : IAuthService
    {
        private readonly IUserRepository UserRepository = userRepository;
        private readonly CompanyDbContext _Context = context;
        private readonly IJwtProvider _JwtProvider = tokenService;
        private readonly IEmailService _EmailService = emailService;

        public async Task<Result<LoginResponse>> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
        {
            var user = await UserRepository.GetByEmailAsync(request.Email);

            if (user == null || user.Password != request.Password)
                return Result.Failure<LoginResponse>(UserErrors.InValidCredentials);

            //Generate Token
            var (Token, ExpiresIn) = _JwtProvider.GenerateToken(user);
       
         
            var response = new LoginResponse
                        (
                            // Assuming LoginResponse has settable properties for these fields.
                            // Replace these property names with the actual property names in LoginResponse.
                             user.Name,
                             user.Email!,
                             user.Type,
                            Token,
                            ExpiresIn
                        );



            return Result.Success(response);
        }

        public async Task<Result<RegisterResponse>> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
        {
            var existingUser = await UserRepository.GetByEmailAsync(request.Email);
            if (existingUser != null)
                return Result.Failure<RegisterResponse>(UserErrors.EmailIsExisted);

            await _Context.Users.AddAsync(request.Adapt<User>(), cancellationToken);
            await _Context.SaveChangesAsync(cancellationToken);


            return Result.Success(request.Adapt<RegisterResponse>());

        }


        public async Task<Result> SendPasswordResetCode(string email, CancellationToken cancellationToken = default)
        {
            var user = await _Context.Users.FirstOrDefaultAsync(x => x.Email == email, cancellationToken);
            if (user == null)
                return Result.Failure(UserErrors.EmailUndefinded);

            // 2) Generate OTP
            var code = new Random().Next(100000, 999999).ToString();

            // 3) Store OTP in DB
            var resetEntry = new PasswordResetToken
            {
                Email = email,
                Code = code,
                ExpireAt = DateTime.UtcNow.AddMinutes(10)
            };

            _Context.PasswordResetTokens.Add(resetEntry);
            await _Context.SaveChangesAsync(cancellationToken);

            // 4) Send email using MailKit
            var subject = "Your Password Reset Code";
            var body = $"Your password reset code is: {code}\n\nThis code will expire in 10 minutes.";

            await _EmailService.SendEmailAsync(email, subject, body);

            return Result.Success();
        }

    }
}
