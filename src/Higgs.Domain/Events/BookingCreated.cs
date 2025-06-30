using System;
using Higgs.Domain.Common;

namespace Higgs.Domain.Events;

public record BookingCreated(
    Guid BookingId,
    Guid CourtId,
    Guid UserId,
    DateTime StartTime,
    DateTime EndTime,
    decimal Amount
) : DomainEvent;