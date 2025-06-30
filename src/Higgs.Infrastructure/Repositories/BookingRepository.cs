using Microsoft.EntityFrameworkCore;
using Higgs.Application.Interfaces;
using Higgs.Domain.Entities;
using Higgs.Infrastructure.Data;

namespace Higgs.Infrastructure.Repositories;

public class BookingRepository : IBookingRepository
{
    private readonly HiggsDbContext _context;

    public BookingRepository(HiggsDbContext context)
    {
        _context = context;
    }

    public async Task<Booking?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Bookings
            .Include(b => b.Court)
            .Include(b => b.User)
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
    }

    public async Task<List<Booking>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Bookings
            .Include(b => b.Court)
            .Include(b => b.User)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Booking>> GetByCourtIdAsync(Guid courtId, CancellationToken cancellationToken = default)
    {
        return await _context.Bookings
            .Include(b => b.Court)
            .Include(b => b.User)
            .Where(b => b.CourtId == courtId)
            .OrderBy(b => b.TimeSlot.StartTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Booking>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Bookings
            .Include(b => b.Court)
            .Include(b => b.User)
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.TimeSlot.StartTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Booking>> GetByDateRangeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
    {
        return await _context.Bookings
            .Include(b => b.Court)
            .Include(b => b.User)
            .Where(b => b.TimeSlot.StartTime.Date >= startDate.Date && 
                       b.TimeSlot.StartTime.Date <= endDate.Date)
            .OrderBy(b => b.TimeSlot.StartTime)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Booking booking, CancellationToken cancellationToken = default)
    {
        await _context.Bookings.AddAsync(booking, cancellationToken);
    }

    public async Task UpdateAsync(Booking booking, CancellationToken cancellationToken = default)
    {
        _context.Bookings.Update(booking);
        await Task.CompletedTask;
    }

    public async Task<bool> HasConflictingBookingAsync(Guid courtId, DateTime startTime, DateTime endTime, 
        Guid? excludeBookingId = null, CancellationToken cancellationToken = default)
    {
        var query = _context.Bookings
            .Where(b => b.CourtId == courtId && 
                       !b.IsCancelled &&
                       b.TimeSlot.StartTime < endTime && 
                       b.TimeSlot.EndTime > startTime);

        if (excludeBookingId.HasValue)
        {
            query = query.Where(b => b.Id != excludeBookingId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }
}