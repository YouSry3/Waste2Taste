using FoodRescue.DAL.Entities;
using FoodRescue.DAL.EntitiesConfigurations;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace FoodRescue.DAL.Context
{
    public class CompanyDbContext(DbContextOptions<CompanyDbContext> options) : DbContext(options)
    {

        public DbSet<User> Users { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
        public DbSet<Vendor> Vendors { get; set; }

        // Configurations
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            modelBuilder.ApplyConfiguration(new PasswordResetTokenConfiguration());

            base.OnModelCreating(modelBuilder);


        }
    }
}
