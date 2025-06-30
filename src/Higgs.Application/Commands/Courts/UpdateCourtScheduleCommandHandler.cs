using Higgs.Application.Common;
using Higgs.Application.Interfaces;
using Higgs.Domain.Common;

namespace Higgs.Application.Commands.Courts;

public class UpdateCourtScheduleCommandHandler : ICommandHandler<UpdateCourtScheduleCommand>
{
    private readonly IPadelCourtRepository _courtRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCourtScheduleCommandHandler(IPadelCourtRepository courtRepository, IUnitOfWork unitOfWork)
    {
        _courtRepository = courtRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(UpdateCourtScheduleCommand request, CancellationToken cancellationToken)
    {
        var court = await _courtRepository.GetByIdAsync(request.CourtId, cancellationToken);
        if (court == null)
            return Result.Failure("Court not found");

        var updateResult = court.UpdateSchedule(request.OpeningTime, request.ClosingTime);
        if (updateResult.IsFailure)
            return Result.Failure(updateResult.Error);

        await _courtRepository.UpdateAsync(court, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}