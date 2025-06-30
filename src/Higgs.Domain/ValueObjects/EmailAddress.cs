using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using Higgs.Domain.Common;

namespace Higgs.Domain.ValueObjects;

public class EmailAddress : ValueObject
{
    private static readonly Regex EmailRegex = new(
        @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public string Value { get; private set; }

    private EmailAddress(string value)
    {
        Value = value;
    }

    public static Result<EmailAddress> Create(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return Result.Failure<EmailAddress>("Email address cannot be empty");

        var trimmedEmail = email.Trim().ToLowerInvariant();

        if (!EmailRegex.IsMatch(trimmedEmail))
            return Result.Failure<EmailAddress>("Invalid email address format");

        return Result.Success(new EmailAddress(trimmedEmail));
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    public override string ToString() => Value;

    public static implicit operator string(EmailAddress email) => email.Value;
}