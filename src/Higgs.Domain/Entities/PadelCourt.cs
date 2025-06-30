using System;
using System.Collections.Generic;
using System.Linq;
using Higgs.Domain.Common;
using Higgs.Domain.ValueObjects;

namespace Higgs.Domain.Entities;

public class PadelCourt : Entity
{
    public string Name { get; private set; }
    public string Description { get; private set; }
    public Price HourlyRate { get; private set; }
    public bool IsActive { get; private set; }
    public TimeOnly OpeningTime { get; private set; }
    public TimeOnly ClosingTime { get; private set; }

    private readonly List<Booking> _bookings = new();
    public IReadOnlyCollection<Booking> Bookings => _bookings.AsReadOnly();

    private PadelCourt(Guid id, string name, string description, Price hourlyRate, 
        TimeOnly openingTime, TimeOnly closingTime) : base(id)
    {
        Name = name;
        Description = description;
        HourlyRate = hourlyRate;
        OpeningTime = openingTime;
        ClosingTime = closingTime;
        IsActive = true;
    }

    private PadelCourt() { } // For EF Core

    public static Result<PadelCourt> Create(string name, string description, Price hourlyRate,
        TimeOnly openingTime, TimeOnly closingTime)
    {
        if (string.IsNullOrWhiteSpace(name))
            return Result.Failure<PadelCourt>("Court name cannot be empty");

        if (openingTime >= closingTime)
            return Result.Failure<PadelCourt>("Opening time must be before closing time");

        return Result.Success(new PadelCourt(
            Guid.NewGuid(),
            name.Trim(),
            description?.Trim() ?? string.Empty,
            hourlyRate,
            openingTime,
            closingTime));
    }

    public Result<List<TimeSlot>> GetAvailableSlots(DateTime date, BookingDuration duration)
    {
        if (date.Date < DateTime.UtcNow.Date)
            return Result.Failure<List<TimeSlot>>("Cannot get availability for past dates");

        if (!IsActive)
            return Result.Failure<List<TimeSlot>>("Court is not active");

        var availableSlots = new List<TimeSlot>();
        var startDateTime = date.Date.Add(OpeningTime.ToTimeSpan());
        var endDateTime = date.Date.Add(ClosingTime.ToTimeSpan());

        // Get existing bookings for the date
        var existingBookings = _bookings
            .Where(b => b.TimeSlot.StartTime.Date == date.Date && !b.IsCancelled)
            .OrderBy(b => b.TimeSlot.StartTime)
            .ToList();

        var currentTime = startDateTime;
        while (currentTime.Add(duration.Duration) <= endDateTime)
        {
            var potentialSlot = TimeSlot.Create(currentTime, currentTime.Add(duration.Duration));
            if (potentialSlot.IsFailure)
            {
                currentTime = currentTime.AddMinutes(30);
                continue;
            }

            var hasConflict = existingBookings.Any(b => b.TimeSlot.OverlapsWith(potentialSlot.Value));
            if (!hasConflict)
            {
                availableSlots.Add(potentialSlot.Value);
            }

            currentTime = currentTime.AddMinutes(30);
        }

        return Result.Success(availableSlots);
    }

    public Result UpdatePricing(Price newHourlyRate)
    {
        HourlyRate = newHourlyRate;
        MarkAsUpdated();
        return Result.Success();
    }

    public Result UpdateSchedule(TimeOnly openingTime, TimeOnly closingTime)
    {
        if (openingTime >= closingTime)
            return Result.Failure("Opening time must be before closing time");

        OpeningTime = openingTime;
        ClosingTime = closingTime;
        MarkAsUpdated();
        return Result.Success();
    }

    public void Deactivate()
    {
        IsActive = false;
        MarkAsUpdated();
    }

    public void Activate()
    {
        IsActive = true;
        MarkAsUpdated();
    }

    internal void AddBooking(Booking booking)
    {
        _bookings.Add(booking);
    }
}