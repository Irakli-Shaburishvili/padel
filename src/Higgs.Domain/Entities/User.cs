using System;
using Higgs.Domain.Common;
using Higgs.Domain.ValueObjects;

namespace Higgs.Domain.Entities;

public class User : Entity
{
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public EmailAddress Email { get; private set; }
    public string PhoneNumber { get; private set; }

    private User(Guid id, string firstName, string lastName, EmailAddress email, string phoneNumber) 
        : base(id)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        PhoneNumber = phoneNumber;
    }

    private User() { } // For EF Core

    public static Result<User> Create(string firstName, string lastName, string email, string phoneNumber)
    {
        if (string.IsNullOrWhiteSpace(firstName))
            return Result.Failure<User>("First name cannot be empty");

        if (string.IsNullOrWhiteSpace(lastName))
            return Result.Failure<User>("Last name cannot be empty");

        if (string.IsNullOrWhiteSpace(phoneNumber))
            return Result.Failure<User>("Phone number cannot be empty");

        var emailResult = EmailAddress.Create(email);
        if (emailResult.IsFailure)
            return Result.Failure<User>(emailResult.Error);

        return Result.Success(new User(
            Guid.NewGuid(),
            firstName.Trim(),
            lastName.Trim(),
            emailResult.Value,
            phoneNumber.Trim()));
    }

    public Result UpdateContactInfo(string firstName, string lastName, string phoneNumber)
    {
        if (string.IsNullOrWhiteSpace(firstName))
            return Result.Failure("First name cannot be empty");

        if (string.IsNullOrWhiteSpace(lastName))
            return Result.Failure("Last name cannot be empty");

        if (string.IsNullOrWhiteSpace(phoneNumber))
            return Result.Failure("Phone number cannot be empty");

        FirstName = firstName.Trim();
        LastName = lastName.Trim();
        PhoneNumber = phoneNumber.Trim();
        MarkAsUpdated();

        return Result.Success();
    }

    public string FullName => $"{FirstName} {LastName}";
}