using FluentValidation.AspNetCore;
using FoodRescue.BLL.Contract.Authentication;
using FoodRescue.BLL.Contract.Authentication.Register;
using FoodRescue.BLL.Extensions.Users;
using FoodRescue.BLL.Extensions.Vendors;
using FoodRescue.BLL.Extensions.Vendors.MapsterConfiguration;
using FoodRescue.BLL.Services.Authentication;
using FoodRescue.BLL.Services.JWT;
using FoodRescue.BLL.Services.Vendors;
using FoodRescue.DAL.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text; // Add this at the top with other using statements

namespace FoodRescue.PL
{
    public static class GlobalServicesExtensions
    {
        public static IServiceCollection AddProjectServices(this IServiceCollection services, IConfiguration configuration, IWebHostEnvironment environment)
        {
            // CORS Configuration
            services.AddCors(options =>
            {
                options.AddPolicy("FoodRescueCors", builder =>
                {
                    if (environment.IsDevelopment())
                    {
                        builder.WithOrigins(
                            "http://localhost:5173",   // Vite dev server
                            "http://localhost:5000",   // Alternative port
                            "http://localhost:3000"    // Another alternative
                        );
                    }
                    else
                    {
                        // In production, specify exact frontend domain
                        builder.WithOrigins(configuration["AllowedOrigins"] ?? "");
                    }

                    builder.AllowAnyMethod()
                           .AllowAnyHeader()
                           .AllowCredentials();
                });
            });

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
            services.AddScoped<IVendorRepository, VendorRepository>();
            services.AddScoped<IVendorService, VendorService>();
            services.AddScoped<IEmailService, EmailService>();
            VendorMapsterConfig.RegisterVendorMappings();

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
