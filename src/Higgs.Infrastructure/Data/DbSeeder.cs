using Higgs.Domain.Entities;
using Higgs.Domain.ValueObjects;
using Higgs.Infrastructure.Data;

namespace Higgs.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(HiggsDbContext context)
    {
        if (context.Courts.Any())
            return; // Already seeded

        // Create courts
        var priceResult = Price.Create(50.00m, "GEL");
        if (priceResult.IsFailure)
            throw new InvalidOperationException("Failed to create price");

        var courts = new[]
        {
            PadelCourt.Create("Court 1", "Main court with professional lighting", priceResult.Value, new TimeOnly(9, 0), new TimeOnly(22, 0)),
            PadelCourt.Create("Court 2", "Secondary court with excellent view", priceResult.Value, new TimeOnly(9, 0), new TimeOnly(22, 0))
        };

        foreach (var courtResult in courts)
        {
            if (courtResult.IsSuccess)
            {
                context.Courts.Add(courtResult.Value);
            }
        }

        // Create admin user
        var adminEmailResult = EmailAddress.Create("admin@higgs.ge");
        if (adminEmailResult.IsSuccess)
        {
            var adminResult = User.Create("Admin", "User", adminEmailResult.Value.Value, "+995555000000");
            if (adminResult.IsSuccess)
            {
                context.Users.Add(adminResult.Value);
            }
        }

        await context.SaveChangesAsync();
    }
}