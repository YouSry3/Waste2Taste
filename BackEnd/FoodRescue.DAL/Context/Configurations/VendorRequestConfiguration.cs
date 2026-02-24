using FoodRescue.DAL.Entities;
using FoodRescue.DAL.Consts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FoodRescue.DAL.Context.Configurations;

/// <summary>
/// Entity Framework Core configuration for the VendorRequest entity.
/// Defines table mapping, column constraints, relationships, indexes, and defaults.
/// </summary>
public class VendorRequestConfiguration : IEntityTypeConfiguration<VendorRequest>
{
    /// <summary>
    /// Configures the VendorRequest entity mapping and constraints.
    /// </summary>
    /// <param name="builder">The entity type builder for VendorRequest</param>
    public void Configure(EntityTypeBuilder<VendorRequest> builder)
    {
        // Table mapping
        builder.ToTable("VendorRequests");

        // Primary key configuration
        builder.HasKey(x => x.Id);

        // Property configurations with constraints
        builder.Property(x => x.Id)
            .HasColumnType("uniqueidentifier")
            .IsRequired();

        builder.Property(x => x.UserId)
            .HasColumnType("uniqueidentifier")
            .IsRequired();

        builder.Property(x => x.BusinessName)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.Address)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(x => x.PhoneNumber)
            .HasMaxLength(20)
            .IsRequired();

        // Category configuration: store enum as string, required
        builder.Property(x => x.Category)
            .HasConversion<string>()
            .HasColumnType("nvarchar(50)")
            .HasMaxLength(50)
            .IsRequired();

        // Enforce allowed category values at the database level (CHECK constraint)
        builder.HasCheckConstraint(
            "CK_VendorRequest_Category_Enum",
            "[Category] IN ('Restaurant','Bakery','Cafe','Grocery','Deli','Market')");

        builder.Property(x => x.HealthCertificateUrl)
            .HasMaxLength(500)
            .IsRequired(false);

        builder.Property(x => x.BusinessLicenseUrl)
            .HasMaxLength(500)
            .IsRequired(false);

        // Status configuration: store enum as string, required, default to Pending
        builder.Property(x => x.Status)
            .HasConversion<string>()
            .HasColumnType("nvarchar(50)")
            .HasMaxLength(50)
            .IsRequired()
            .HasDefaultValueSql("N'Pending'");

        // Enforce allowed status values at the database level (CHECK constraint)
        builder.HasCheckConstraint(
            "CK_VendorRequest_Status_Enum",
            "[Status] IN ('Pending','Approved','Rejected')");

        builder.Property(x => x.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("GETDATE()");

        builder.Property(x => x.ReviewedAt)
            .IsRequired(false);

       

        // Relationships
        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict); // Prevent deleting user if vendor request exists

        // Indexes for performance
        builder.HasIndex(x => x.UserId)
            .HasDatabaseName("IX_VendorRequests_UserId");

        builder.HasIndex(x => x.Status)
            .HasDatabaseName("IX_VendorRequests_Status");

        builder.HasIndex(x => x.CreatedAt)
            .HasDatabaseName("IX_VendorRequests_CreatedAt");

        // Composite index for filtering pending requests
        builder.HasIndex(x => new { x.Status, x.CreatedAt })
            .HasDatabaseName("IX_VendorRequests_Status_CreatedAt");
    }
}
