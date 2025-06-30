using MediatR;
using Microsoft.AspNetCore.Mvc;
using Higgs.Application.Queries.Pricing;
using Higgs.Application.Commands.Pricing;

namespace Higgs.Api.Endpoints;

public static class PricingEndpoints
{
    public static void MapPricingEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/pricing")
            .WithTags("Pricing");

        // Public endpoints
        group.MapGet("/", GetPricing)
            .WithName("GetPricing")
            .WithOpenApi();

        // Admin endpoints (protected)
        group.MapPut("/", UpdatePricing)
            .WithName("UpdatePricing")
            .RequireAuthorization()
            .WithOpenApi();
    }

    private static async Task<IResult> GetPricing(IMediator mediator)
    {
        var query = new GetPricingQuery();
        var result = await mediator.Send(query);

        return result.IsSuccess 
            ? Results.Ok(result.Value)
            : Results.BadRequest(new { Error = result.Error });
    }

    private static async Task<IResult> UpdatePricing(
        [FromBody] UpdatePricingRequest request,
        IMediator mediator)
    {
        var command = new UpdatePricingCommand(request.CourtId, request.HourlyRate);
        var result = await mediator.Send(command);

        return result.IsSuccess 
            ? Results.NoContent()
            : Results.BadRequest(new { Error = result.Error });
    }
}

public record UpdatePricingRequest(Guid CourtId, decimal HourlyRate);