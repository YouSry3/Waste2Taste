using FoodRescue.BLL.Settings;
using FoodRescue.DAL.Context;
using Microsoft.EntityFrameworkCore;


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




          



            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();




            var emailSettings = builder.Configuration
                .GetSection("EmailSettings")
                .Get<EmailSettings>();

            System.Net.ServicePointManager.SecurityProtocol =
         System.Net.SecurityProtocolType.Tls12;
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            // Use CORS policy
            app.UseCors("FoodRescueCors");


            // Create wwwroot if not exists
            var webRootPath = app.Environment.WebRootPath ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot");
            if (!Directory.Exists(webRootPath))
            {
                Directory.CreateDirectory(webRootPath);
            }

            app.UseStaticFiles(); // Serve images from wwwroot
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
