using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Higgs.Domain.Entities;

namespace Higgs.Infrastructure.Data.Configurations;

public class PadelCourtConfiguration : IEntityTypeConfiguration<PadelCourt>
{
    public void Configure(EntityTypeBuilder<PadelCourt> builder)
    {
        builder.HasKey(c => c.Id);
        
        builder.Property(c => c.Id)
            .ValueGeneratedNever();

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(c => c.Description)
            .HasMaxLength(1000);

        builder.Property(c => c.IsActive)
            .IsRequired();

        builder.Property(c => c.OpeningTime)
            .IsRequired();

        builder.Property(c => c.ClosingTime)
            .IsRequired();

        builder.Property(c => c.CreatedAt)
            .IsRequired();

        builder.Property(c => c.UpdatedAt);

        // Configure Price value object
        builder.OwnsOne(c => c.HourlyRate, p =>
        {
            p.Property(pr => pr.Amount)
                .HasColumnName("HourlyRateAmount")
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            p.Property(pr => pr.Currency)
                .HasColumnName("HourlyRateCurrency")
                .HasMaxLength(3)
                .IsRequired();
        });

        // Relationships
        builder.HasMany(c => c.Bookings)
            .WithOne(b => b.Court)
            .HasForeignKey(b => b.CourtId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(c => c.Name);
        builder.HasIndex(c => c.IsActive);

        // Ignore domain events
        builder.Ignore(c => c.DomainEvents);
    }
}