using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FoodRescue.DAL.Context.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasKey(o => o.Id);

            // Customer (User) Relationship
            builder.Property(o => o.CustomerId)
                   .IsRequired();

            builder.HasOne(o => o.Customer)
                   .WithMany(u => u.Orders)
                   .HasForeignKey(o => o.CustomerId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Product Relationship
            builder.Property(o => o.ProuductId)
                   .IsRequired();

            builder.HasOne(o => o.Product)
                   .WithMany(p => p.Orders)
                   .HasForeignKey(o => o.ProuductId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.Property(o => o.Status)
                   .IsRequired()
                   .HasMaxLength(50);

            builder.Property(o => o.TotalPrice)
                   .HasColumnType("decimal(18,2)")
                   .IsRequired();

            

            builder.Property(o => o.CreatedAt)
                   .IsRequired();
        }
    }
}
