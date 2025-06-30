using System;
using Higgs.Application.Common;
using Higgs.Domain.ValueObjects;

namespace Higgs.Application.Queries.Courts;

public record GetAvailableTimeSlotsQuery(
    Guid CourtId,
    DateTime Date,
    int DurationMinutes = 60
) : IQuery<List<TimeSlot>>;