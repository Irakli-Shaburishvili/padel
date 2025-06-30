using Higgs.Application.Common;
using Higgs.Domain.ValueObjects;

namespace Higgs.Application.Queries.Pricing;

public record GetPricingQuery : IQuery<List<CourtPricing>>;

public record CourtPricing(
    Guid CourtId,
    string CourtName,
    Price HourlyRate
);