using FoodRescue.DAL.Entities;
using FoodRescue.DAL.EntitiesConfigurations;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace FoodRescue.DAL.Context
{
    public class CompanyDbContext(DbContextOptions<CompanyDbContext> options) : DbContext(options)
    {

        public DbSet<User> Users { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }


        // Configurations
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            modelBuilder.ApplyConfiguration(new PasswordResetTokenConfiguration());

            base.OnModelCreating(modelBuilder);

         
        }
    }
}
