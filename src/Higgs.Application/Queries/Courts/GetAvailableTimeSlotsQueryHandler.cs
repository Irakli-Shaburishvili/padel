using Higgs.Application.Common;
using Higgs.Application.Interfaces;
using Higgs.Domain.Common;
using Higgs.Domain.ValueObjects;

namespace Higgs.Application.Queries.Courts;

public class GetAvailableTimeSlotsQueryHandler : IQueryHandler<GetAvailableTimeSlotsQuery, List<TimeSlot>>
{
    private readonly IPadelCourtRepository _courtRepository;

    public GetAvailableTimeSlotsQueryHandler(IPadelCourtRepository courtRepository)
    {
        _courtRepository = courtRepository;
    }

    public async Task<Result<List<TimeSlot>>> Handle(GetAvailableTimeSlotsQuery request, CancellationToken cancellationToken)
    {
        var court = await _courtRepository.GetByIdAsync(request.CourtId, cancellationToken);
        if (court == null)
            return Result.Failure<List<TimeSlot>>("Court not found");

        var durationResult = BookingDuration.CreateFromMinutes(request.DurationMinutes);
        if (durationResult.IsFailure)
            return Result.Failure<List<TimeSlot>>(durationResult.Error);

        var availableSlotsResult = court.GetAvailableSlots(request.Date, durationResult.Value);
        if (availableSlotsResult.IsFailure)
            return Result.Failure<List<TimeSlot>>(availableSlotsResult.Error);

        return Result.Success(availableSlotsResult.Value);
    }
}