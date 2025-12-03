using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace FoodRescue.DAL.Context.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            // Table name
            builder.ToTable("Users");

            // Primary key
            builder.HasKey(x => x.Id);

            // Unique email
            builder.HasIndex(x => x.Email).IsUnique();

            // Email
            builder.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(255);

            // Password
            builder.Property(x => x.Password)
                .IsRequired()
                .HasMaxLength(255);

            // Name
            builder.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(255);

            // Type (admin, vendor, customer)
            builder.Property(x => x.Type)
                .IsRequired()
                .HasMaxLength(50);

            // CreatedAt default in Data Base 
            builder.Property(x => x.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");
        }

    }
}
