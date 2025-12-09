using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Reports.Create
{
    public class ReportRequestValidator : AbstractValidator<ReportRequest>
    {
        public ReportRequestValidator()
        {
            
            RuleFor(x => x.VendorId)
                .NotEmpty().WithMessage("Vendor ID is required.");

            RuleFor(x => x.Type)
                .NotEmpty().WithMessage("Report type is required.")
                .MaximumLength(50).WithMessage("Report type must not exceed 50 characters.")
                .Must(type => type == "Complaint" || type == "Bug" || type == "Other")
                .WithMessage("Type must be 'Complaint', 'Bug', or 'Other'.");


            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required.")
                .MaximumLength(500).WithMessage("Description must not exceed 500 characters.");
        }
    }
}
