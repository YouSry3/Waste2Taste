using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Products
{
    public class ProductRequestValidator : AbstractValidator<ProductRequest>
    {
        public ProductRequestValidator() {
            RuleFor(x => x.vendorId)
                .NotEmpty().WithMessage("Vendor ID is required");
            
            RuleFor(x => x.expired)
                .NotNull().WithMessage("Expired status is required");
        }
    }
}
