using Higgs.Domain.Entities;

namespace Higgs.Application.Interfaces;

public interface IBookingRepository
{
    Task<Booking?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<Booking>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<List<Booking>> GetByCourtIdAsync(Guid courtId, CancellationToken cancellationToken = default);
    Task<List<Booking>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<List<Booking>> GetByDateRangeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
    Task AddAsync(Booking booking, CancellationToken cancellationToken = default);
    Task UpdateAsync(Booking booking, CancellationToken cancellationToken = default);
    Task<bool> HasConflictingBookingAsync(Guid courtId, DateTime startTime, DateTime endTime, Guid? excludeBookingId = null, CancellationToken cancellationToken = default);
}