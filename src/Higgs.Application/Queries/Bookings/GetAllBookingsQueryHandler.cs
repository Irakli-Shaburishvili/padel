using Higgs.Application.Common;
using Higgs.Application.Interfaces;
using Higgs.Domain.Common;
using Higgs.Domain.Entities;

namespace Higgs.Application.Queries.Bookings;

public class GetAllBookingsQueryHandler : IQueryHandler<GetAllBookingsQuery, List<Booking>>
{
    private readonly IBookingRepository _bookingRepository;

    public GetAllBookingsQueryHandler(IBookingRepository bookingRepository)
    {
        _bookingRepository = bookingRepository;
    }

    public async Task<Result<List<Booking>>> Handle(GetAllBookingsQuery request, CancellationToken cancellationToken)
    {
        var bookings = await _bookingRepository.GetAllAsync(cancellationToken);
        return Result.Success(bookings);
    }
}