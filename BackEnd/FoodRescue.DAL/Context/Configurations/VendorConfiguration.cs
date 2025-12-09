using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FoodRescue.DAL.Context.Configurations
{
    public class VendorConfiguration : IEntityTypeConfiguration<Vendor>
    {
        public void Configure(EntityTypeBuilder<Vendor> builder)
        {
            builder.ToTable("Vendors");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(x => x.Address)
                .HasMaxLength(500);

            builder.Property(x => x.Status)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(x => x.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // Relations
            builder.HasMany(x => x.Products)
                .WithOne(p => p.Vendor)
                .HasForeignKey(p => p.VendorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.Orders)
                .WithOne(o => o.Vendor)
                .HasForeignKey(o => o.VendorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.Donations)
                .WithOne(d => d.Vendor)
                .HasForeignKey(d => d.VendorId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
