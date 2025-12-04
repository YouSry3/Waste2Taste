using FluentValidation;

namespace FoodRescue.BLL.Contract.Vendors;

public class UpdateVendorRequestValidator : AbstractValidator<UpdateVendorRequest>
{
    public UpdateVendorRequestValidator()
    {
        RuleFor(x => x.Name)
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.")
            .When(x => x.Name != null);

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Address cannot be empty if provided.")
            .When(x => x.Address != null);

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status cannot be empty.")
            .When(x => x.Status != null);
    }
}
