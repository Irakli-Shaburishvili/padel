using System;
using System.Collections.Generic;
using Higgs.Domain.Common;

namespace Higgs.Domain.ValueObjects;

public class BookingDuration : ValueObject
{
    public TimeSpan Duration { get; private set; }

    private BookingDuration(TimeSpan duration)
    {
        Duration = duration;
    }

    public static Result<BookingDuration> Create(TimeSpan duration)
    {
        if (duration <= TimeSpan.Zero)
            return Result.Failure<BookingDuration>("Duration must be positive");

        if (duration.TotalMinutes < 30)
            return Result.Failure<BookingDuration>("Minimum booking duration is 30 minutes");

        if (duration.TotalMinutes > 240) // 4 hours max
            return Result.Failure<BookingDuration>("Maximum booking duration is 4 hours");

        // Ensure duration is in 30-minute increments
        var totalMinutes = (int)duration.TotalMinutes;
        if (totalMinutes % 30 != 0)
            return Result.Failure<BookingDuration>("Booking duration must be in 30-minute increments");

        return Result.Success(new BookingDuration(duration));
    }

    public static Result<BookingDuration> CreateFromHours(double hours)
    {
        if (hours <= 0)
            return Result.Failure<BookingDuration>("Hours must be positive");

        return Create(TimeSpan.FromHours(hours));
    }

    public static Result<BookingDuration> CreateFromMinutes(int minutes)
    {
        if (minutes <= 0)
            return Result.Failure<BookingDuration>("Minutes must be positive");

        return Create(TimeSpan.FromMinutes(minutes));
    }

    public int TotalHours => (int)Duration.TotalHours;
    public int TotalMinutes => (int)Duration.TotalMinutes;

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Duration;
    }

    public override string ToString()
    {
        var hours = Duration.Hours;
        var minutes = Duration.Minutes;

        if (hours > 0 && minutes > 0)
            return $"{hours}h {minutes}m";
        if (hours > 0)
            return $"{hours}h";
        return $"{minutes}m";
    }
}