using FluentValidation;

namespace FoodRescue.BLL.Contract.Products;

public class UpdateProductRequestValidator : AbstractValidator<UpdateProductRequest>
{
    public UpdateProductRequestValidator()
    {
        RuleFor(x => x.Name).MaximumLength(200)
            .When(x => x.Name != null);

        RuleFor(x => x.Price).GreaterThan(0)
            .When(x => x.Price.HasValue);

        RuleFor(x => x.Quantity).GreaterThanOrEqualTo(0)
            .When(x => x.Quantity.HasValue);
    }
}
