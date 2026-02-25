using FluentValidation;
using FoodRescue.BLL.Contract.VendorDashboard;
using FoodRescue.DAL.Consts;
using System.Text.RegularExpressions;

namespace FoodRescue.BLL.Contract.VendorDashboard.Validators;

/// <summary>
/// Validator for VendorDataRequest using FluentValidation.
/// Ensures all required fields are properly filled and meet validation criteria.
/// </summary>
public class VendorDataRequestValidator : AbstractValidator<VendorDataRequest>
{
    /// <summary>
    /// Initializes a new instance of the VendorDataRequestValidator class.
    /// Sets up validation rules for all VendorDataRequest properties.
    /// </summary>
    public VendorDataRequestValidator()
    {
        

        // BusinessName validation
        RuleFor(x => x.BusinessName)
            .NotEmpty().WithMessage("Business name is required.")
            .MinimumLength(3).WithMessage("Business name must be at least 3 characters long.")
            .MaximumLength(200).WithMessage("Business name must not exceed 200 characters.")
            .Matches(@"^[a-zA-Z0-9\s\-&.,()]+$")
            .WithMessage("Business name contains invalid characters. Only alphanumeric, spaces, and basic punctuation are allowed.");

        // Category validation
        RuleFor(x => x.Category)
            .IsInEnum().WithMessage("Category must be a valid value (Restaurant, Bakery, Cafe, Grocery, Deli, or Market).");

        // Email validation
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email address is required.")
            .EmailAddress().WithMessage("Email address is not valid.")
            .MaximumLength(255).WithMessage("Email address must not exceed 255 characters.");

        // PhoneNumber validation
        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Phone number is required.")
            .Matches(@"^\+?[0-9\s\-()]{7,20}$")
            .WithMessage("Phone number format is invalid. Must be between 7-20 characters and contain only digits, +, spaces, hyphens, and parentheses.")
            .MaximumLength(20).WithMessage("Phone number must not exceed 20 characters.");

        // Address validation
        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Address is required.")
            .MinimumLength(5).WithMessage("Address must be at least 5 characters long.")
            .MaximumLength(500).WithMessage("Address must not exceed 500 characters.");

        // BusinessLicenseUrl validation (optional)
        RuleFor(x => x.BusinessLicenseUrl)
            .Must(IsValidUrl).WithMessage("Business License URL format is invalid.")
            .MaximumLength(500).WithMessage("Business License URL must not exceed 500 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.BusinessLicenseUrl));

        // HealthCertificateUrl validation (optional)
        RuleFor(x => x.HealthCertificateUrl)
            .Must(IsValidUrl).WithMessage("Health Certificate URL format is invalid.")
            .MaximumLength(500).WithMessage("Health Certificate URL must not exceed 500 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.HealthCertificateUrl));
    }

    /// <summary>
    /// Validates if a string is a valid URL format.
    /// </summary>
    /// <param name="url">The URL string to validate.</param>
    /// <returns>True if the URL is valid or null/empty; otherwise, false.</returns>
    private bool IsValidUrl(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return true; // Allow null/empty as URLs are optional

        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
            && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}
