using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace FoodRescue.BLL.Contract.Products;

public class CreateProductRequestValidator : AbstractValidator<CreateProductRequest>
{
    public CreateProductRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Description)
            .NotEmpty()
            .MaximumLength(2000);

        RuleFor(x => x.Price)
            .GreaterThan(0);

        RuleFor(x => x.OriginalPrice)
            .GreaterThan(0)
            .GreaterThan(x => x.Price)
            .WithMessage("Original price must be greater than discounted price.");

        RuleFor(x => x.Quantity)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.ExpiryDate)
            .GreaterThan(DateTime.Now)
            .WithMessage("Expiry date must be in the future.");

        RuleFor(x => x.VendorId)
            .NotEmpty();

        RuleFor(x => x.ImageFile)
            .NotNull()
            .Must(BeAValidImage)
            .WithMessage("Please upload a valid image file (jpg, jpeg, png).");
    }

    private bool BeAValidImage(IFormFile? file)
    {
        if (file == null) return false;

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        return allowedExtensions.Contains(extension) && file.Length > 0 && file.Length <= 5 * 1024 * 1024; // 5MB max
    }
}
