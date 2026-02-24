using FluentEmail.Core;
using FoodRescue.BLL.ResultPattern;
using FoodRescue.BLL.Contract.Authentication;
using FoodRescue.BLL.Contract.Authentication.ForgetPassword.CheckCode;
using FoodRescue.BLL.Contract.Authentication.ForgetPassword.UpdatePassword;
using FoodRescue.BLL.Contract.Authentication.Login;
using FoodRescue.BLL.Contract.Authentication.Register;
using FoodRescue.BLL.Extensions.Users;
using FoodRescue.BLL.ResultPattern.TypeErrors;
using FoodRescue.BLL.Services.Authentication.Email_Service;
using FoodRescue.BLL.Services.JWT;
using FoodRescue.DAL.Context;
using FoodRescue.DAL.Entities;
using Mapster;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FoodRescue.BLL.Services.Authentication.AuthServices
{
    public class AuthService(
        IUserRepository userRepository,
        CompanyDbContext context,
        IJwtProvider tokenService,
        EmailService emailService,
        IFluentEmail email
        ) : IAuthService
    {
        private readonly IUserRepository UserRepository = userRepository;
        private readonly CompanyDbContext _Context = context;
        private readonly IJwtProvider _JwtProvider = tokenService;
        private readonly EmailService EmailService = emailService;
        private readonly IFluentEmail _email = email;

        public async Task<Result<LoginResponse>> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
        {
            var user = await UserRepository.GetByEmailAsync(request.Email);

            if (user == null || user.Password != request.Password)
                return Result.Failure<LoginResponse>(UserErrors.InValidCredentials);

            //Generate Token
            var (Token, ExpiresIn) = _JwtProvider.GenerateToken(user);
       
         

            return Result.Success(new LoginResponse
                        (
                             // Assuming LoginResponse has settable properties for these fields.
                             // Replace these property names with the actual property names in LoginResponse.
                             user.Name,
                             user.Email!,
                             user.Role,
                            Token,
                            ExpiresIn,
                            user.ImageUrl

                        ));
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


        public async Task<Result> SendPasswordResetCode(
                             string email,
     CancellationToken cancellationToken = default)
        {
            // 1) Check if user exists
            var user = await _Context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Email == email, cancellationToken);

            if (user == null)
                return Result.Failure(UserErrors.EmailUndefinded);

            // 2) Generate secure OTP (6 digits)
            var code = Random.Shared.Next(100000, 999999).ToString();

            // 3) Store OTP in DB
            var resetEntry = new PasswordResetToken
            {
                Email = email,
                Code = code,
                ExpireAt = DateTime.Now.AddMinutes(10),
                IsUsed = false
            };

            await _Context.PasswordResetTokens.AddAsync(resetEntry, cancellationToken);
            await _Context.SaveChangesAsync(cancellationToken);

            // 4) Prepare email content
            var subject = "Your Password Reset Code";

            var body = $@"
                        <!DOCTYPE html>
                        <html lang='en'>
                        <head>
                            <meta charset='UTF-8' />
                            <style>
                                body {{
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f6f8;
                                    margin: 0;
                                    padding: 0;
                                }}
                                .container {{
                                    max-width: 600px;
                                    margin: 40px auto;
                                    background: #ffffff;
                                    border-radius: 8px;
                                    padding: 20px;
                                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                                    color: #333333;
                                }}
                                h2 {{
                                    color: #007bff;
                                }}
                                .code {{
                                    font-size: 36px;
                                    font-weight: bold;
                                    color: #007bff;
                                    background: #e6f0ff;
                                    padding: 15px;
                                    border-radius: 8px;
                                    text-align: center;
                                    letter-spacing: 4px;
                                    user-select: all;
                                }}
                            </style>
                        </head>
                        <body>
                            <div class='container'>
                                <h2>Password Reset Code</h2>
                                <p>Your password reset code is:</p>
                                <div class='code'>{code}</div>
                                <p>This code will expire in <strong>10 minutes</strong>.</p>
                                <p>If you didn't request this, please ignore this email.</p>
                            </div>
                        </body>
                        </html>";

            // 5) Send email
            await EmailService.SendAsync(email, subject, body);

            return Result.Success();
        }

        public async Task<Result> VerifyResetCode(VerifyResetCodeRequest Request, CancellationToken cancellationToken = default)
        {
            var resetEntry = await _Context.PasswordResetTokens
                                .FirstOrDefaultAsync(x => x.Email == Request.Email && x.Code == Request.Code, cancellationToken);

            if (resetEntry == null || resetEntry.ExpireAt < DateTime.Now)
                return Result.Failure(UserErrors.InValidCode);

            // Mark code as used
            resetEntry.IsUsed = true;
            await _Context.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }

        public async Task<Result> ResetPassword(ForgetPasswordRequest Request, CancellationToken cancellationToken = default)
        {
            var resetEntry = await _Context.PasswordResetTokens
                                .FirstOrDefaultAsync(
                                                x => x.Email == Request.email
                                                && x.Code == Request.code, cancellationToken);

            if (resetEntry == null || resetEntry.ExpireAt < DateTime.Now)
                return Result.Failure(UserErrors.InValidCredentials);

            var user = await UserRepository.GetByEmailAsync(Request.email);
            if (user == null)
                return Result.Failure(UserErrors.EmailUndefinded);

            if (UserRepository.CheckDuplication(user, Request.newpassword))
                return Result.Failure(UserErrors.DuplicationPassword);

            // Update password and I ensure add Same Password check before
            user.Password = Request.newpassword;

            await UserRepository.UpdateAsync(user);

            // Remove used reset token
            _Context.PasswordResetTokens.Remove(resetEntry);

            await UserRepository.SaveChangesAsync();

            return Result.Success();
        }


    }
}
