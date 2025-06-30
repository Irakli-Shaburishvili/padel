using MediatR;
using Microsoft.AspNetCore.Mvc;
using Higgs.Application.Queries.Courts;
using Higgs.Application.Commands.Courts;

namespace Higgs.Api.Endpoints;

public static class CourtEndpoints
{
    public static void MapCourtEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/courts")
            .WithTags("Courts");

        // Public endpoints
        group.MapGet("/{courtId:guid}/availability", GetAvailableTimeSlots)
            .WithName("GetAvailableTimeSlots")
            .WithOpenApi();

        // Admin endpoints (protected)
        group.MapPost("/{courtId:guid}/schedule", UpdateCourtSchedule)
            .WithName("UpdateCourtSchedule")
            .RequireAuthorization()
            .WithOpenApi();
    }

    private static async Task<IResult> GetAvailableTimeSlots(
        Guid courtId,
        [FromQuery] DateTime date,
        IMediator mediator,
        [FromQuery] int durationMinutes = 60)
    {
        var query = new GetAvailableTimeSlotsQuery(courtId, date, durationMinutes);
        var result = await mediator.Send(query);

        return result.IsSuccess 
            ? Results.Ok(result.Value)
            : Results.BadRequest(new { Error = result.Error });
    }

    private static async Task<IResult> UpdateCourtSchedule(
        Guid courtId,
        [FromBody] UpdateScheduleRequest request,
        IMediator mediator)
    {
        var command = new UpdateCourtScheduleCommand(
            courtId, 
            request.OpeningTime, 
            request.ClosingTime);

        var result = await mediator.Send(command);

        return result.IsSuccess 
            ? Results.NoContent()
            : Results.BadRequest(new { Error = result.Error });
    }
}

public record UpdateScheduleRequest(TimeOnly OpeningTime, TimeOnly ClosingTime);