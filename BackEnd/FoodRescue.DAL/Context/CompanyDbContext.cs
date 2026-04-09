using FoodRescue.DAL.Context.Configurations;
using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace FoodRescue.DAL.Context
{
    public class CompanyDbContext : DbContext
    {
        public CompanyDbContext(DbContextOptions<CompanyDbContext> options)
            : base(options)  // <--- هنا يجب تمرير options ل base class
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<Donation> Donations { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<VendorRequest> VendorRequests { get; set; }
        public DbSet<AISpoileRequest> AISpoileRequests { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(CompanyDbContext).Assembly);

            modelBuilder.ApplyConfiguration(new PasswordResetTokenConfiguration());
            modelBuilder.ApplyConfiguration(new VendorConfiguration());
            modelBuilder.ApplyConfiguration(new ProductConfiguration());

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Customer)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.CustomerId);

            base.OnModelCreating(modelBuilder);
        }
    }
}
