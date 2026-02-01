using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace FoodRescue.DAL.Context.Configurations
{
    public class ReviewConfigration : IEntityTypeConfiguration<Review>
    {
        public void Configure(EntityTypeBuilder<Review> builder)
        {
            // Table Name
            builder.ToTable("Reviews");

            // Primary Key
            builder.HasKey(r => r.Id);

            // Properties
            builder.Property(r => r.Rating)
                .IsRequired()
                .HasPrecision(2, 1);


            builder.Property(r => r.Comment)
                   .HasMaxLength(500);

            builder.Property(r => r.CreatedAt)
                   .IsRequired();

            // Relationship: Review -> User (Many Reviews, One User)
            builder.HasOne(r => r.User)
                   .WithMany(u => u.Reviews)
                   .HasForeignKey(r => r.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            // Relationship: Review -> Product (Many Reviews, One Product)
            builder.HasOne(r => r.Product)
                   .WithMany(p => p.Reviews)
                   .HasForeignKey(r => r.ProductId)
                   .OnDelete(DeleteBehavior.Cascade);
        }

    }
}
