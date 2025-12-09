using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace FoodRescue.DAL.Context
{
    public class CompanyDbContextFactory : IDesignTimeDbContextFactory<CompanyDbContext>
    {
        public CompanyDbContext CreateDbContext(string[] args)
        {
            // EF Core at design-time cannot load appsettings.json
            var connectionString =
                "Server=.;Database=FoodRescueAppDB;Trusted_Connection=True;TrustServerCertificate=True;";

            var builder = new DbContextOptionsBuilder<CompanyDbContext>();
            builder.UseSqlServer(connectionString);

            return new CompanyDbContext(builder.Options);
        }
    }
}
