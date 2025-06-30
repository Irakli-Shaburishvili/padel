using System;
using System.Collections.Generic;
using Higgs.Domain.Common;

namespace Higgs.Domain.ValueObjects;

public class Price : ValueObject
{
    public decimal Amount { get; private set; }
    public string Currency { get; private set; }

    private Price(decimal amount, string currency)
    {
        Amount = amount;
        Currency = currency;
    }

    public static Result<Price> Create(decimal amount, string currency = "GEL")
    {
        if (amount < 0)
            return Result.Failure<Price>("Price cannot be negative");

        if (string.IsNullOrWhiteSpace(currency))
            return Result.Failure<Price>("Currency cannot be empty");

        var normalizedCurrency = currency.Trim().ToUpperInvariant();
        
        // For simplicity, we'll support only GEL for now
        if (normalizedCurrency != "GEL")
            return Result.Failure<Price>("Only GEL currency is supported");

        return Result.Success(new Price(amount, normalizedCurrency));
    }

    public Price Add(Price other)
    {
        if (Currency != other.Currency)
            throw new InvalidOperationException("Cannot add prices with different currencies");

        return new Price(Amount + other.Amount, Currency);
    }

    public Price Multiply(decimal multiplier)
    {
        if (multiplier < 0)
            throw new ArgumentException("Multiplier cannot be negative");

        return new Price(Amount * multiplier, Currency);
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Amount;
        yield return Currency;
    }

    public override string ToString() => $"{Amount:F2} {Currency}";

    public static Price operator +(Price left, Price right) => left.Add(right);
    public static Price operator *(Price price, decimal multiplier) => price.Multiply(multiplier);
    public static Price operator *(decimal multiplier, Price price) => price.Multiply(multiplier);
}