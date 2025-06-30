using System;
using Higgs.Domain.Common;
using Higgs.Domain.Events;
using Higgs.Domain.ValueObjects;

namespace Higgs.Domain.Entities;

public enum BookingStatus
{
    Pending,
    Confirmed,
    Cancelled,
    Completed
}

public class Booking : Entity
{
    public Guid CourtId { get; private set; }
    public Guid UserId { get; private set; }
    public TimeSlot TimeSlot { get; private set; }
    public BookingDuration Duration { get; private set; }
    public Price TotalPrice { get; private set; }
    public BookingStatus Status { get; private set; }
    public string? CustomerName { get; private set; }
    public string? CustomerEmail { get; private set; }
    public string? CustomerPhone { get; private set; }
    public string? Notes { get; private set; }
    public DateTime? CancelledAt { get; private set; }
    public string? CancellationReason { get; private set; }

    // Navigation properties
    public PadelCourt Court { get; private set; }
    public User? User { get; private set; }

    public bool IsCancelled => Status == BookingStatus.Cancelled;
    public bool IsConfirmed => Status == BookingStatus.Confirmed;

    private Booking(Guid id, Guid courtId, Guid? userId, TimeSlot timeSlot, 
        BookingDuration duration, Price totalPrice, string customerName, 
        string customerEmail, string customerPhone, string? notes) : base(id)
    {
        CourtId = courtId;
        UserId = userId ?? Guid.Empty;
        TimeSlot = timeSlot;
        Duration = duration;
        TotalPrice = totalPrice;
        Status = BookingStatus.Pending;
        CustomerName = customerName;
        CustomerEmail = customerEmail;
        CustomerPhone = customerPhone;
        Notes = notes;
    }

    private Booking() { } // For EF Core

    public static Result<Booking> Create(PadelCourt court, TimeSlot timeSlot, 
        string customerName, string customerEmail, string customerPhone, 
        User? user = null, string? notes = null)
    {
        if (court == null)
            return Result.Failure<Booking>("Court cannot be null");

        if (!court.IsActive)
            return Result.Failure<Booking>("Cannot book inactive court");

        if (string.IsNullOrWhiteSpace(customerName))
            return Result.Failure<Booking>("Customer name is required");

        var emailResult = EmailAddress.Create(customerEmail);
        if (emailResult.IsFailure)
            return Result.Failure<Booking>(emailResult.Error);

        if (string.IsNullOrWhiteSpace(customerPhone))
            return Result.Failure<Booking>("Customer phone is required");

        // Calculate duration and price
        var durationResult = BookingDuration.CreateFromMinutes((int)timeSlot.Duration.TotalMinutes);
        if (durationResult.IsFailure)
            return Result.Failure<Booking>(durationResult.Error);

        var totalPrice = court.HourlyRate.Multiply((decimal)timeSlot.Duration.TotalHours);

        var booking = new Booking(
            Guid.NewGuid(),
            court.Id,
            user?.Id,
            timeSlot,
            durationResult.Value,
            totalPrice,
            customerName.Trim(),
            emailResult.Value.Value,
            customerPhone.Trim(),
            notes?.Trim());

        court.AddBooking(booking);

        booking.AddDomainEvent(new BookingCreated(
            booking.Id,
            booking.CourtId,
            booking.UserId,
            booking.TimeSlot.StartTime,
            booking.TimeSlot.EndTime,
            booking.TotalPrice.Amount));

        return Result.Success(booking);
    }

    public Result Confirm()
    {
        if (Status != BookingStatus.Pending)
            return Result.Failure("Only pending bookings can be confirmed");

        Status = BookingStatus.Confirmed;
        MarkAsUpdated();
        return Result.Success();
    }

    public Result Cancel(string reason)
    {
        if (Status == BookingStatus.Cancelled)
            return Result.Failure("Booking is already cancelled");

        if (Status == BookingStatus.Completed)
            return Result.Failure("Cannot cancel completed booking");

        if (string.IsNullOrWhiteSpace(reason))
            return Result.Failure("Cancellation reason is required");

        Status = BookingStatus.Cancelled;
        CancelledAt = DateTime.UtcNow;
        CancellationReason = reason.Trim();
        MarkAsUpdated();

        AddDomainEvent(new BookingCancelled(
            Id,
            CourtId,
            UserId,
            CancelledAt.Value,
            CancellationReason));

        return Result.Success();
    }

    public Result Complete()
    {
        if (Status != BookingStatus.Confirmed)
            return Result.Failure("Only confirmed bookings can be completed");

        if (DateTime.UtcNow < TimeSlot.EndTime)
            return Result.Failure("Cannot complete booking before end time");

        Status = BookingStatus.Completed;
        MarkAsUpdated();
        return Result.Success();
    }

    public bool CanBeCancelledByCustomer()
    {
        // Allow cancellation up to 2 hours before start time
        return Status != BookingStatus.Cancelled 
            && Status != BookingStatus.Completed
            && TimeSlot.StartTime.Subtract(DateTime.UtcNow).TotalHours >= 2;
    }
}