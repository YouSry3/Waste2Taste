using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FoodRescue.DAL.Context.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.Description)
            .HasMaxLength(2000)
            .IsRequired();

        builder.Property(x => x.Price)
            .HasColumnType("decimal(10,2)")
            .IsRequired();

        builder.Property(x => x.OriginalPrice)
            .HasColumnType("decimal(10,2)")
            .IsRequired();

        builder.Property(x => x.Quantity)
            .IsRequired();

        builder.Property(x => x.Expired)
            .HasDefaultValue(false);

        builder.Property(x => x.ExpiryDate)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .HasDefaultValueSql("GETDATE()");

        builder.Property(x => x.ImageUrl)
            .HasMaxLength(500)
            .IsRequired();

        // Vendor relationship
        builder.HasOne(x => x.Vendor)
            .WithMany(v => v.Products)
            .HasForeignKey(x => x.VendorId);

        //  NEW: Orders relationship (One Product → Many Orders)
        builder.HasMany(x => x.Orders)
            .WithOne(o => o.Product)
            .HasForeignKey(o => o.ProductId)
            .OnDelete(DeleteBehavior.Restrict); // Prevent deleting product if orders exist
    }
}
