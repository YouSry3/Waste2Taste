using FluentValidation;

namespace FoodRescue.BLL.Contract.Products;

public class CreateProductRequestValidator : AbstractValidator<CreateProductRequest>
{
    public CreateProductRequestValidator()
    {
        RuleFor(x => x.VendorId).NotEmpty().WithMessage("this is Required");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(20);
        RuleFor(x => x.Price).GreaterThan(0);
        RuleFor(x => x.Discount).GreaterThanOrEqualTo(0).LessThanOrEqualTo(100);
        RuleFor(x => x.Quantity).GreaterThanOrEqualTo(0);       
    }
}
