using FluentValidation.AspNetCore;
using FoodRescue.BLL.Contract.Authentication;
using FoodRescue.BLL.Contract.Authentication.Register;
using FoodRescue.BLL.Extensions.Users;
using FoodRescue.BLL.Services.Authentication;
using FoodRescue.BLL.Services.JWT;
using FoodRescue.DAL.Context;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Text; // Add this at the top with other using statements

namespace FoodRescue.PL
{
    public static class GlobalServicesExtensions
    {
        public static IServiceCollection AddProjectServices(this IServiceCollection services, IConfiguration configuration)
        {
            // DbContext
            services.AddDbContext<CompanyDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly("FoodRescue.DAL")));

            services.AddServices();

            services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));


            services.AddJwtService(configuration);

            // Register FluentValidation 
            services.AddControllers()
                .AddFluentValidation(fv =>
                {
                    // Automatically register validators from the assembly containing RegisterRequestValidator
                    fv.RegisterValidatorsFromAssembly(typeof(RegisterRequestValidator).Assembly);
                });

            return services;
        }

        private static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IJwtProvider, JwtProvider>();
            services.AddScoped<IEmailService, EmailService>();



            return services;
        }

        private static IServiceCollection AddJwtService(this IServiceCollection services,
            IConfiguration Configuration)
        {
            services.AddAuthentication("Bearer")
                .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = Configuration["Jwt:Issuer"],
            ValidAudience = Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]!))
        };
    });

            return services;
        }
    }
}
