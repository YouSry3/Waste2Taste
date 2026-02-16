using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace FoodRescue.BLL.Contract.Products;

public class UpdateProductRequestValidator : AbstractValidator<UpdateProductRequest>
{
    public UpdateProductRequestValidator()
    {
        RuleFor(x => x.Name)
            .MaximumLength(200)
            .When(x => x.Name != null);

        RuleFor(x => x.Description)
            .MaximumLength(2000)
            .When(x => x.Description != null);

        RuleFor(x => x.Price)
            .GreaterThan(0)
            .When(x => x.Price.HasValue);

        RuleFor(x => x.OriginalPrice)
            .GreaterThan(0)
            .When(x => x.OriginalPrice.HasValue);

        RuleFor(x => x.Quantity)
            .GreaterThanOrEqualTo(0)
            .When(x => x.Quantity.HasValue);

        RuleFor(x => x.ExpiryDate)
            .GreaterThan(DateTime.Now)
            .When(x => x.ExpiryDate.HasValue);

        RuleFor(x => x.ImageFile)
            .Must(BeAValidImage)
            .When(x => x.ImageFile != null)
            .WithMessage("Please upload a valid image file (jpg, jpeg, png, max 5MB).");
    }

    private bool BeAValidImage(IFormFile? file)
    {
        if (file == null) return true;

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        return allowedExtensions.Contains(extension) && file.Length > 0 && file.Length <= 5 * 1024 * 1024;
    }
}
