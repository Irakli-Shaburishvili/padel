using Higgs.Application.Common;
using Higgs.Application.Interfaces;
using Higgs.Domain.Common;

namespace Higgs.Application.Queries.Pricing;

public class GetPricingQueryHandler : IQueryHandler<GetPricingQuery, List<CourtPricing>>
{
    private readonly IPadelCourtRepository _courtRepository;

    public GetPricingQueryHandler(IPadelCourtRepository courtRepository)
    {
        _courtRepository = courtRepository;
    }

    public async Task<Result<List<CourtPricing>>> Handle(GetPricingQuery request, CancellationToken cancellationToken)
    {
        var courts = await _courtRepository.GetActiveAsync(cancellationToken);
        
        var pricing = courts.Select(court => new CourtPricing(
            court.Id,
            court.Name,
            court.HourlyRate
        )).ToList();

        return Result.Success(pricing);
    }
}