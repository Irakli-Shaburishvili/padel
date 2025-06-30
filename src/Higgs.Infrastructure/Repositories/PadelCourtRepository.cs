using Microsoft.EntityFrameworkCore;
using Higgs.Application.Interfaces;
using Higgs.Domain.Entities;
using Higgs.Infrastructure.Data;

namespace Higgs.Infrastructure.Repositories;

public class PadelCourtRepository : IPadelCourtRepository
{
    private readonly HiggsDbContext _context;

    public PadelCourtRepository(HiggsDbContext context)
    {
        _context = context;
    }

    public async Task<PadelCourt?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Courts
            .Include(c => c.Bookings.Where(b => !b.IsCancelled))
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<List<PadelCourt>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Courts
            .OrderBy(c => c.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<PadelCourt>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Courts
            .Where(c => c.IsActive)
            .OrderBy(c => c.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(PadelCourt court, CancellationToken cancellationToken = default)
    {
        await _context.Courts.AddAsync(court, cancellationToken);
    }

    public async Task UpdateAsync(PadelCourt court, CancellationToken cancellationToken = default)
    {
        _context.Courts.Update(court);
        await Task.CompletedTask;
    }
}