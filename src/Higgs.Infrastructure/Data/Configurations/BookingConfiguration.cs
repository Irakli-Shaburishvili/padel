using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Higgs.Domain.Entities;
using Higgs.Domain.ValueObjects;

namespace Higgs.Infrastructure.Data.Configurations;

public class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.HasKey(b => b.Id);
        
        builder.Property(b => b.Id)
            .ValueGeneratedNever();

        builder.Property(b => b.CourtId)
            .IsRequired();

        builder.Property(b => b.UserId)
            .IsRequired();

        builder.Property(b => b.Status)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(b => b.CustomerName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(b => b.CustomerEmail)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(b => b.CustomerPhone)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(b => b.Notes)
            .HasMaxLength(1000);

        builder.Property(b => b.CancellationReason)
            .HasMaxLength(500);

        builder.Property(b => b.CreatedAt)
            .IsRequired();

        builder.Property(b => b.UpdatedAt);

        builder.Property(b => b.CancelledAt);

        // Configure TimeSlot value object
        builder.OwnsOne(b => b.TimeSlot, ts =>
        {
            ts.Property(t => t.StartTime)
                .HasColumnName("StartTime")
                .IsRequired();

            ts.Property(t => t.EndTime)
                .HasColumnName("EndTime")
                .IsRequired();
        });

        // Configure Duration value object
        builder.OwnsOne(b => b.Duration, d =>
        {
            d.Property(dur => dur.Duration)
                .HasColumnName("Duration")
                .IsRequired();
        });

        // Configure Price value object
        builder.OwnsOne(b => b.TotalPrice, p =>
        {
            p.Property(pr => pr.Amount)
                .HasColumnName("TotalAmount")
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            p.Property(pr => pr.Currency)
                .HasColumnName("Currency")
                .HasMaxLength(3)
                .IsRequired();
        });

        // Relationships
        builder.HasOne(b => b.Court)
            .WithMany(c => c.Bookings)
            .HasForeignKey(b => b.CourtId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(b => b.User)
            .WithMany()
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(b => b.CourtId);
        builder.HasIndex(b => b.UserId);
        builder.HasIndex(b => b.Status);

        // Ignore domain events
        builder.Ignore(b => b.DomainEvents);
    }
}