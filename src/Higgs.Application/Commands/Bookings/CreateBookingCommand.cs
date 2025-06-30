using System;
using Higgs.Application.Common;

namespace Higgs.Application.Commands.Bookings;

public record CreateBookingCommand(
    Guid CourtId,
    DateTime StartTime,
    DateTime EndTime,
    string CustomerName,
    string CustomerEmail,
    string CustomerPhone,
    string? Notes = null
) : ICommand<Guid>;