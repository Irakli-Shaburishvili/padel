using Higgs.Domain.Entities;

namespace Higgs.Application.Interfaces;

public interface IPadelCourtRepository
{
    Task<PadelCourt?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<PadelCourt>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<List<PadelCourt>> GetActiveAsync(CancellationToken cancellationToken = default);
    Task AddAsync(PadelCourt court, CancellationToken cancellationToken = default);
    Task UpdateAsync(PadelCourt court, CancellationToken cancellationToken = default);
}