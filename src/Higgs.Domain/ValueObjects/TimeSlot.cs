using System;
using System.Collections.Generic;
using Higgs.Domain.Common;

namespace Higgs.Domain.ValueObjects;

public class TimeSlot : ValueObject
{
    public DateTime StartTime { get; private set; }
    public DateTime EndTime { get; private set; }

    private TimeSlot(DateTime startTime, DateTime endTime)
    {
        StartTime = startTime;
        EndTime = endTime;
    }

    public static Result<TimeSlot> Create(DateTime startTime, DateTime endTime)
    {
        if (startTime >= endTime)
            return Result.Failure<TimeSlot>("Start time must be before end time");

        if (startTime < DateTime.UtcNow)
            return Result.Failure<TimeSlot>("Cannot create time slot in the past");

        // Round to nearest 30 minutes for consistency
        var roundedStart = RoundToNearestHalfHour(startTime);
        var roundedEnd = RoundToNearestHalfHour(endTime);

        if (roundedEnd <= roundedStart)
            return Result.Failure<TimeSlot>("Invalid time slot duration after rounding");

        return Result.Success(new TimeSlot(roundedStart, roundedEnd));
    }

    public static Result<TimeSlot> Create(DateTime date, TimeOnly startTime, TimeOnly endTime)
    {
        var startDateTime = date.Date.Add(startTime.ToTimeSpan());
        var endDateTime = date.Date.Add(endTime.ToTimeSpan());

        return Create(startDateTime, endDateTime);
    }

    public TimeSpan Duration => EndTime - StartTime;

    public bool OverlapsWith(TimeSlot other)
    {
        return StartTime < other.EndTime && EndTime > other.StartTime;
    }

    private static DateTime RoundToNearestHalfHour(DateTime dateTime)
    {
        var minutes = dateTime.Minute;
        var roundedMinutes = minutes < 30 ? 0 : 30;
        return new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, 
            dateTime.Hour, roundedMinutes, 0, DateTimeKind.Utc);
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return StartTime;
        yield return EndTime;
    }

    public override string ToString() => $"{StartTime:yyyy-MM-dd HH:mm} - {EndTime:HH:mm}";
}