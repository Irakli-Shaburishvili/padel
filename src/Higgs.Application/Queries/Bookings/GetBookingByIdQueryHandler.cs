using Higgs.Application.Common;
using Higgs.Application.Interfaces;
using Higgs.Domain.Common;
using Higgs.Domain.Entities;

namespace Higgs.Application.Queries.Bookings;

public class GetBookingByIdQueryHandler : IQueryHandler<GetBookingByIdQuery, Booking>
{
    private readonly IBookingRepository _bookingRepository;

    public GetBookingByIdQueryHandler(IBookingRepository bookingRepository)
    {
        _bookingRepository = bookingRepository;
    }

    public async Task<Result<Booking>> Handle(GetBookingByIdQuery request, CancellationToken cancellationToken)
    {
        var booking = await _bookingRepository.GetByIdAsync(request.BookingId, cancellationToken);
        if (booking == null)
            return Result.Failure<Booking>("Booking not found");

        return Result.Success(booking);
    }
}