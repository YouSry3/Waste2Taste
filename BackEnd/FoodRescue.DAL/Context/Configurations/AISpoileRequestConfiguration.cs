using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FoodRescue.DAL.Context.Configurations;

public class AISpoileRequestConfiguration : IEntityTypeConfiguration<AISpoileRequest>
{
    public void Configure(EntityTypeBuilder<AISpoileRequest> builder)
    {
        builder.ToTable("AISpoileRequests");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.ProductId)
            .IsRequired();

        builder.Property(x => x.Prediction)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.Confidence)
            .HasColumnType("decimal(3,2)")
            .IsRequired();

        builder.Property(x => x.SpoiledPercentage)
            .IsRequired();

        builder.Property(x => x.IsSpoiled)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .HasDefaultValueSql("GETDATE()");

        // One-to-One relationship: AISpoileRequest → Product
        builder.HasOne(x => x.Product)
            .WithOne(p => p.AISpoileRequest)
            .HasForeignKey<AISpoileRequest>(x => x.ProductId)
            .OnDelete(DeleteBehavior.Cascade); // Delete AISpoileRequest when Product is deleted
    }
}
