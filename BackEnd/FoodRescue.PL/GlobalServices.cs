using FluentValidation.AspNetCore;
using FoodRescue.BLL.Contract.Authentication.ForgetPassword.Settings;
using FoodRescue.BLL.Contract.Authentication.Register;
using FoodRescue.BLL.Extensions.Orders;
using FoodRescue.BLL.Extensions.Products;
using FoodRescue.BLL.Extensions.Users;
using FoodRescue.BLL.Extensions.Vendors;
using FoodRescue.BLL.Extensions.Vendors.MapsterConfiguration;
using FoodRescue.BLL.Services.Authentication.AuthServices;
using FoodRescue.BLL.Services.Authentication.Email_Service;
using FoodRescue.BLL.Services.JWT;
using FoodRescue.BLL.Services.Orders;
using FoodRescue.BLL.Services.Products;
using FoodRescue.BLL.Services.Reviews;
using FoodRescue.BLL.Services.Vendors;
using FoodRescue.BLL.Settings;
using FoodRescue.DAL.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using System.Net.Mail;
using System.Text;

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
       
            services.AddServices();

            services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));


                services.Configure<EmailSettings>(
            configuration.GetSection("EmailSettings"));

                

                services.ConfigrationsDataBase(configuration);


            services.AddJwtService(configuration);

            // Register FluentValidation 
            services.AddControllers()
                .AddFluentValidation(fv =>
                {
                    // Automatically register validators from the assembly containing RegisterRequestValidator
                    fv.RegisterValidatorsFromAssembly(typeof(RegisterRequestValidator).Assembly);
                });

            var emailSettings = configuration.GetSection("EmailSettings").Get<EmailSettings>();

            if (emailSettings != null)
            {
                services
                    .AddFluentEmail(emailSettings.Username)
                    .AddSmtpSender(new SmtpClient(emailSettings.Host)
                    {
                        Port = emailSettings.Port,
                        Credentials = new NetworkCredential(emailSettings.Username, emailSettings.Password),
                        EnableSsl = emailSettings.EnableSSL
                    });
            }

            return services;
        }

        private static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IJwtProvider, JwtProvider>();
            services.AddScoped<IVendorRepository, VendorRepository>();
            services.AddScoped<IVendorService, VendorService>();
            services.AddScoped<EmailService>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IReviewService, ReviewService>();
            services.AddScoped<EmailService>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IOrderService, OrderService>();


            VendorMapsterConfig.RegisterVendorMappings();

            return services;
        }
        private static IServiceCollection ConfigrationsDataBase(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<CompanyDbContext>(options =>
           options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
           b => b.MigrationsAssembly("FoodRescue.DAL")));

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
