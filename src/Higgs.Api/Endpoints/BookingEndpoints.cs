using MediatR;
using Microsoft.AspNetCore.Mvc;
using Higgs.Application.Commands.Bookings;
using Higgs.Application.Queries.Bookings;

namespace Higgs.Api.Endpoints;

public static class BookingEndpoints
{
    public static void MapBookingEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/bookings")
            .WithTags("Bookings");

        // Public endpoints
        group.MapPost("/", CreateBooking)
            .WithName("CreateBooking")
            .WithOpenApi();

        group.MapGet("/{id:guid}", GetBookingById)
            .WithName("GetBookingById")
            .WithOpenApi();

        // Admin endpoints (protected)
        group.MapGet("/", GetAllBookings)
            .WithName("GetAllBookings")
            .RequireAuthorization()
            .WithOpenApi();

        group.MapDelete("/{id:guid}", CancelBooking)
            .WithName("CancelBooking")
            .RequireAuthorization()
            .WithOpenApi();
    }

    private static async Task<IResult> CreateBooking(
        [FromBody] CreateBookingRequest request, 
        IMediator mediator)
    {
        var command = new CreateBookingCommand(
            request.CourtId,
            request.StartTime,
            request.EndTime,
            request.CustomerName,
            request.CustomerEmail,
            request.CustomerPhone,
            request.Notes);

        var result = await mediator.Send(command);

        return result.IsSuccess 
            ? Results.Created($"/api/bookings/{result.Value}", new { Id = result.Value })
            : Results.BadRequest(new { Error = result.Error });
    }

    private static async Task<IResult> GetBookingById(
        Guid id, 
        IMediator mediator)
    {
        var query = new GetBookingByIdQuery(id);
        var result = await mediator.Send(query);

        return result.IsSuccess 
            ? Results.Ok(result.Value)
            : Results.NotFound(new { Error = result.Error });
    }

    private static async Task<IResult> GetAllBookings(IMediator mediator)
    {
        var query = new GetAllBookingsQuery();
        var result = await mediator.Send(query);

        return result.IsSuccess 
            ? Results.Ok(result.Value)
            : Results.BadRequest(new { Error = result.Error });
    }

    private static async Task<IResult> CancelBooking(
        Guid id, 
        [FromBody] CancelBookingRequest request,
        IMediator mediator)
    {
        var command = new CancelBookingCommand(id, request.Reason);
        var result = await mediator.Send(command);

        return result.IsSuccess 
            ? Results.NoContent()
            : Results.BadRequest(new { Error = result.Error });
    }
}

public record CreateBookingRequest(
    Guid CourtId,
    DateTime StartTime,
    DateTime EndTime,
    string CustomerName,
    string CustomerEmail,
    string CustomerPhone,
    string? Notes = null);

public record CancelBookingRequest(string Reason);