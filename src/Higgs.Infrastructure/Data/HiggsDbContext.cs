using Microsoft.EntityFrameworkCore;
using Higgs.Domain.Entities;
using Higgs.Infrastructure.Data.Configurations;

namespace Higgs.Infrastructure.Data;

public class HiggsDbContext : DbContext
{
    public HiggsDbContext(DbContextOptions<HiggsDbContext> options) : base(options)
    {
    }

    public DbSet<Booking> Bookings { get; set; }
    public DbSet<PadelCourt> Courts { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new BookingConfiguration());
        modelBuilder.ApplyConfiguration(new PadelCourtConfiguration());
        modelBuilder.ApplyConfiguration(new UserConfiguration());

        base.OnModelCreating(modelBuilder);
    }
}