using Higgs.Application.Common;
using Higgs.Domain.Entities;

namespace Higgs.Application.Queries.Bookings;

public record GetAllBookingsQuery : IQuery<List<Booking>>;