using FoodRescue.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FoodRescue.DAL.Context.Configurations
{
    public class PasswordResetTokenConfiguration : IEntityTypeConfiguration<PasswordResetToken>
    {
        public void Configure(EntityTypeBuilder<PasswordResetToken> builder)
        {
            builder.ToTable("PasswordResetTokens");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(255);
                

            builder.Property(x => x.Code)
                .IsRequired()
                .HasMaxLength(10);

            builder.Property(x => x.IsUsed)
                .HasDefaultValue(false);
        }
    }
}
