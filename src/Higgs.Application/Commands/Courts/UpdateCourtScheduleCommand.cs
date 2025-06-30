using System;
using Higgs.Application.Common;

namespace Higgs.Application.Commands.Courts;

public record UpdateCourtScheduleCommand(
    Guid CourtId,
    TimeOnly OpeningTime,
    TimeOnly ClosingTime
) : ICommand;