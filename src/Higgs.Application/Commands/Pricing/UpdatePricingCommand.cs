using System;
using Higgs.Application.Common;

namespace Higgs.Application.Commands.Pricing;

public record UpdatePricingCommand(
    Guid CourtId,
    decimal HourlyRate
) : ICommand;