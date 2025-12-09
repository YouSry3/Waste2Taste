using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Reports.Update
{
    public class ReportStatusRequestValidator : AbstractValidator<ReportStatusRequest>
    {
        private static readonly string[] ValidStatuses = { "Pending", "In Progress", "Resolved", "Rejected" };

        public ReportStatusRequestValidator()
        {
            RuleFor(x => x.NewStatus)
                .NotEmpty().WithMessage("New status is required.")
                .MaximumLength(50).WithMessage("Status must not exceed 50 characters.")
                .Must(status => ValidStatuses.Contains(status, StringComparer.OrdinalIgnoreCase))
                .WithMessage($"Status must be one of the following: {string.Join(", ", ValidStatuses)}.");
        }
    }
}
