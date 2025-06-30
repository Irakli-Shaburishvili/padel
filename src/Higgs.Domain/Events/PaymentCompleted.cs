using System;
using Higgs.Domain.Common;

namespace Higgs.Domain.Events;

public record PaymentCompleted(
    Guid BookingId,
    Guid PaymentId,
    decimal Amount,
    string PaymentMethod,
    DateTime CompletedAt
) : DomainEvent;