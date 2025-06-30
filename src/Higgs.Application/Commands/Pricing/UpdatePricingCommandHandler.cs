using Higgs.Application.Common;
using Higgs.Application.Interfaces;
using Higgs.Domain.Common;
using Higgs.Domain.ValueObjects;

namespace Higgs.Application.Commands.Pricing;

public class UpdatePricingCommandHandler : ICommandHandler<UpdatePricingCommand>
{
    private readonly IPadelCourtRepository _courtRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdatePricingCommandHandler(IPadelCourtRepository courtRepository, IUnitOfWork unitOfWork)
    {
        _courtRepository = courtRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(UpdatePricingCommand request, CancellationToken cancellationToken)
    {
        var court = await _courtRepository.GetByIdAsync(request.CourtId, cancellationToken);
        if (court == null)
            return Result.Failure("Court not found");

        var priceResult = Price.Create(request.HourlyRate);
        if (priceResult.IsFailure)
            return Result.Failure(priceResult.Error);

        var updateResult = court.UpdatePricing(priceResult.Value);
        if (updateResult.IsFailure)
            return Result.Failure(updateResult.Error);

        await _courtRepository.UpdateAsync(court, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}