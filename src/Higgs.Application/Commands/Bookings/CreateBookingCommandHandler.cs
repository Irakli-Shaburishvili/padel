using Higgs.Application.Common;
using Higgs.Application.Interfaces;
using Higgs.Domain.Common;
using Higgs.Domain.Entities;
using Higgs.Domain.ValueObjects;

namespace Higgs.Application.Commands.Bookings;

public class CreateBookingCommandHandler : ICommandHandler<CreateBookingCommand, Guid>
{
    private readonly IPadelCourtRepository _courtRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateBookingCommandHandler(
        IPadelCourtRepository courtRepository,
        IBookingRepository bookingRepository,
        IUnitOfWork unitOfWork)
    {
        _courtRepository = courtRepository;
        _bookingRepository = bookingRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Guid>> Handle(CreateBookingCommand request, CancellationToken cancellationToken)
    {
        // Get the court
        var court = await _courtRepository.GetByIdAsync(request.CourtId, cancellationToken);
        if (court == null)
            return Result.Failure<Guid>("Court not found");

        // Create time slot
        var timeSlotResult = TimeSlot.Create(request.StartTime, request.EndTime);
        if (timeSlotResult.IsFailure)
            return Result.Failure<Guid>(timeSlotResult.Error);

        // Check for conflicts
        var hasConflict = await _bookingRepository.HasConflictingBookingAsync(
            request.CourtId, 
            request.StartTime, 
            request.EndTime, 
            cancellationToken: cancellationToken);

        if (hasConflict)
            return Result.Failure<Guid>("Time slot is not available");

        // Create booking
        var bookingResult = Booking.Create(
            court,
            timeSlotResult.Value,
            request.CustomerName,
            request.CustomerEmail,
            request.CustomerPhone,
            notes: request.Notes);

        if (bookingResult.IsFailure)
            return Result.Failure<Guid>(bookingResult.Error);

        // Save booking
        await _bookingRepository.AddAsync(bookingResult.Value, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(bookingResult.Value.Id);
    }
}