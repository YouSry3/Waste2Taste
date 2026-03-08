using FluentValidation;
using FluentValidation.AspNetCore;
using FoodRescue.BLL.Contract.Authentication.Register;
using FoodRescue.BLL.Contract.Products;
using FoodRescue.BLL.Extensions.Dashboard;
using FoodRescue.BLL.Extensions.Dashboard.AnalyticsDashboardTab;
using FoodRescue.BLL.Extensions.Dashboard.ListingDashboardTab;
using FoodRescue.BLL.Extensions.Dashboard.OrderDashboardTab;
using FoodRescue.BLL.Extensions.Vendors;
using FoodRescue.BLL.Extensions.Vendors.MapsterConfiguration;
using FoodRescue.BLL.Repositorys.Dashboard;
using FoodRescue.BLL.Services.AnalyticsDashboardTab;
using FoodRescue.BLL.Services.Authentication.AuthServices;
using FoodRescue.BLL.Services.Authentication.Email_Service;
using FoodRescue.BLL.Services.FileStorage;
using FoodRescue.BLL.Services.JWT;
using FoodRescue.BLL.Services.ListingDashboardTab;
using FoodRescue.BLL.Services.OrderDashboardTab;
using FoodRescue.BLL.Services.Orders;
using FoodRescue.BLL.Services.Products;
using FoodRescue.BLL.Services.Reports;
using FoodRescue.BLL.Services.Reviews;
using FoodRescue.BLL.Services.UserServices;
using FoodRescue.BLL.Services.Vendors;
using FoodRescue.BLL.ServicesWeb.Admin;
using FoodRescue.BLL.ServicesWeb.Admin.Moderation;
using FoodRescue.BLL.ServicesWeb.VendorDashboard;
using FoodRescue.BLL.Settings;
using FoodRescue.DAL.Context;
using FoodRescue.DAL.Extensions.Dashboard;
using Microsoft.EntityFrameworkCore;
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
            // CORS Configuration
            services.AddCors(options =>
            {
                options.AddPolicy("FoodRescueCors", builder =>
                {
                    if (environment.IsDevelopment())
                    {
                        builder
                            .SetIsOriginAllowed(_ => true)  // ✅ Allow any origin in dev
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials();            // ✅ Required for SignalR
                    }
                    else
                    {
                        builder
                            .WithOrigins(configuration["AllowedOrigins"] ?? "")
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials();
                    }
                });
            });

            // DbContext

            services.AddServices();
            services.AddSignalR();
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
            services.AddScoped<IUserService, UserService>();
            services.AddValidatorsFromAssemblyContaining<CreateProductRequestValidator>();
            services.AddScoped<IDashboardServices, DashboardService>();
            services.AddScoped<IDashboardRepository, DashboardRepository>();
            services.AddScoped<IModerationService, ModerationService>();
            services.AddScoped<IReportsService, ReportsService>();
            services.AddScoped<IVendorRequestService, VendorRequestService>();
            services.AddScoped<IListingApprovalService, ListingApprovalService>();
            services.AddScoped<IAISpoilageDetectionService, AISpoilageDetectionService>();
            services.AddHttpClient<IAISpoilageDetectionService, AISpoilageDetectionService>()
                .ConfigureHttpClient(client =>
                {
                    client.Timeout = TimeSpan.FromSeconds(30);
                });
            services.AddScoped<IVendorDashboardRepository, VendorDashboardRepository>();
            services.AddScoped<IVendorDashboardService, VendorDashboardService>();
            services.AddScoped<IVendorOrderRepository, VendorOrderRepository>();
            services.AddScoped<IVendorOrderService, VendorOrderService>();
            services.AddScoped<IVendorListingRepository, VendorListingRepository>();
            services.AddScoped<IVendorListingService, VendorListingService>();
            services.AddScoped<IVendorAnalyticsRepository, VendorAnalyticsRepository>();
            services.AddScoped<IVendorAnalyticsService, VendorAnalyticsService>();
            services.AddScoped<IFileStorageService, FileStorageService>();

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
