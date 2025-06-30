using System;

namespace Higgs.Domain.Common;

public interface IDomainEvent
{
    Guid Id { get; }
    DateTime OccurredOn { get; }
}

public abstract record DomainEvent(Guid Id, DateTime OccurredOn) : IDomainEvent
{
    protected DomainEvent() : this(Guid.NewGuid(), DateTime.UtcNow) { }
}