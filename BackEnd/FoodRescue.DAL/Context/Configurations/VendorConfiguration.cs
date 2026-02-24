using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FoodRescue.DAL.Context.Configurations;

public class VendorConfiguration : IEntityTypeConfiguration<Vendor>
{
    public void Configure(EntityTypeBuilder<Vendor> builder)
    {
        builder.ToTable("vendors");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name).IsRequired();
        builder.Property(x => x.Address).IsRequired();

        builder.Property(x => x.CreatedAt).IsRequired();

        // Category configuration: store enum as string, required
        builder.Property(x => x.Category)
            .HasConversion<string>()
            .HasColumnType("nvarchar(50)")
            .HasMaxLength(50)
            .IsRequired();

        // Enforce allowed category values at the database level (CHECK constraint)
        builder.HasCheckConstraint(
            "CK_Vendor_Category_Enum",
            "[Category] IN ('Restaurant','Bakery','Cafe','Grocery','Deli','Market')");

        builder.HasOne(v => v.Owner)
            .WithMany()
            .HasForeignKey(v => v.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        //  ADDED: PhoneNumber configuration
        builder.Property(x => x.PhoneNumber)
            .HasMaxLength(11)
            .IsRequired(false);

        builder.HasOne(v => v.Owner)
            .WithMany()
            .HasForeignKey(v => v.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        // Products relationship
        builder.HasMany(v => v.Products)
            .WithOne(p => p.Vendor)
            .HasForeignKey(p => p.VendorId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
