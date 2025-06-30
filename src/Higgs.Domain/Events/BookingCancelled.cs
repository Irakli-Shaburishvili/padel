using System;
using Higgs.Domain.Common;

namespace Higgs.Domain.Events;

public record BookingCancelled(
    Guid BookingId,
    Guid CourtId,
    Guid UserId,
    DateTime CancelledAt,
    string Reason
) : DomainEvent;