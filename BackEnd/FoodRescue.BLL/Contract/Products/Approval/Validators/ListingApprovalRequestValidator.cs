using FluentValidation;
using FoodRescue.BLL.Contract.Products.Approval;
using FoodRescue.DAL.Consts;

namespace FoodRescue.BLL.Contract.Products.Approval.Validators;

public class ListingApprovalRequestValidator : AbstractValidator<ListingApprovalRequest>
{
    public ListingApprovalRequestValidator()
    {
        RuleFor(x => x.ProductId)
            .NotEmpty().WithMessage("Product ID is required.");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Status must be a valid value (Available, OutOfStock, Discontinued, Pending, or Approved).")
            .Must(status => status == ProductStatus.Approved || status == ProductStatus.Available)
            .WithMessage("Status must be either 'Approved' or 'Available'.");

        RuleFor(x => x.RejectionReason)
            .MaximumLength(500).WithMessage("Rejection reason must not exceed 500 characters.")
            .NotEmpty().WithMessage("Rejection reason is required.")
            .When(x => x.Status != ProductStatus.Approved && x.Status != ProductStatus.Available);
    }
}
