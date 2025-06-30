using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Higgs.Domain.Entities;

namespace Higgs.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);
        
        builder.Property(u => u.Id)
            .ValueGeneratedNever();

        builder.Property(u => u.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.PhoneNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(u => u.CreatedAt)
            .IsRequired();

        builder.Property(u => u.UpdatedAt);

        // Configure Email value object
        builder.OwnsOne(u => u.Email, e =>
        {
            e.Property(em => em.Value)
                .HasColumnName("Email")
                .HasMaxLength(500)
                .IsRequired();
            
            e.HasIndex(em => em.Value)
                .IsUnique()
                .HasDatabaseName("IX_Users_Email");
        });

        // Indexes
        builder.HasIndex(u => u.PhoneNumber);

        // Ignore domain events
        builder.Ignore(u => u.DomainEvents);
    }
}