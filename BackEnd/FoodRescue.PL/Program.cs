using FirebaseAdmin;
using FoodRescue.BLL.Settings;
using FoodRescue.Hubs;
using Google.Apis.Auth.OAuth2;


namespace FoodRescue.PL
{
    public class Program
    {

        //NEWWWWWWWWWWWWWWW
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            //builder.Services.AddDbContext<CompanyDbContext>(options =>
            //options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Add services to the container.
            builder.Services.AddProjectServices(builder.Configuration, builder.Environment);




            builder.Services.AddSignalR();

            builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                var xmlFile = Path.Combine(AppContext.BaseDirectory, "FoodRescue.PL.xml");
                if (File.Exists(xmlFile))
                {
                    c.IncludeXmlComments(xmlFile);
                }
            });

            builder.WebHost.ConfigureKestrel(options =>
            {
                options.Limits.MaxRequestBodySize = 50 * 1024 * 1024; // 50MB
            });

            FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile("Firebase/serviceAccountKey.json")
            });

            var emailSettings = builder.Configuration
                .GetSection("EmailSettings")
                .Get<EmailSettings>();

            System.Net.ServicePointManager.SecurityProtocol =
         System.Net.SecurityProtocolType.Tls12;
            var app = builder.Build();

            app.UseCors("FoodRescueCors");

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            // Use CORS policy



            // Create wwwroot if not exists
            var webRootPath = app.Environment.WebRootPath ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot");
            if (!Directory.Exists(webRootPath))
            {
                Directory.CreateDirectory(webRootPath);
            }

            app.UseStaticFiles(); // Serve images from wwwroot
            app.MapHub<PresenceHub>("/presenceHub");
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
