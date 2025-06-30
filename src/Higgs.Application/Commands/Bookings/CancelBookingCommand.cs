using System;
using Higgs.Application.Common;

namespace Higgs.Application.Commands.Bookings;

public record CancelBookingCommand(
    Guid BookingId,
    string Reason
) : ICommand;