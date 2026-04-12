using FoodRescue.DAL.Entities;
using FoodRescue.DAL.Consts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FoodRescue.DAL.Context.Configurations;

/// <summary>
/// Entity Framework Core configuration for the Report entity.
/// Defines table mapping, column constraints, relationships, indexes, and defaults.
/// </summary>
public class ReportConfiguration : IEntityTypeConfiguration<Report>
{
    /// <summary>
    /// Configures the Report entity mapping and constraints.
    /// </summary>
    /// <param name="builder">The entity type builder for Report</param>
    public void Configure(EntityTypeBuilder<Report> builder)
    {
        builder.ToTable("reports");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.IssueType)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(x => x.Description)
            .IsRequired(false);

        builder.Property(x => x.Status)
            .IsRequired()
            .HasMaxLength(50);

        // Priority configuration: store enum as string, required, default to Medium
        builder.Property(x => x.Priority)
            .HasConversion<string>()
            .HasColumnType("nvarchar(50)")
            .HasMaxLength(50)
            .IsRequired()
            .HasDefaultValueSql("N'Medium'");

        // Enforce allowed priority values at the database level (CHECK constraint)
        builder.HasCheckConstraint(
            "CK_Report_Priority_Enum",
            "[Priority] IN ('Low','Medium','High')");

        builder.Property(x => x.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        // User relationship
        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Product relationship (Report is about a Product, not a Vendor)
        builder.HasOne(x => x.Product)
            .WithMany()
            .HasForeignKey(x => x.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes for performance
        builder.HasIndex(x => x.UserId)
            .HasDatabaseName("IX_Reports_UserId");

        builder.HasIndex(x => x.ProductId)
            .HasDatabaseName("IX_Reports_ProductId");

        builder.HasIndex(x => x.Status)
            .HasDatabaseName("IX_Reports_Status");

        builder.HasIndex(x => x.Priority)
            .HasDatabaseName("IX_Reports_Priority");

        // Composite index for filtering reports by status and priority
        builder.HasIndex(x => new { x.Status, x.Priority })
            .HasDatabaseName("IX_Reports_Status_Priority");

        // Composite index for filtering reports by creation date
        builder.HasIndex(x => new { x.CreatedAt, x.Status })
            .HasDatabaseName("IX_Reports_CreatedAt_Status");
    }
}
