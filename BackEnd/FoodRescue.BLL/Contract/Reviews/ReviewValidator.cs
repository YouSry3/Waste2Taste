using FluentValidation;
using FoodRescue.BLL.Contract.Products;
using FoodRescue.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Reviews
{
    public class ReviewValidator : AbstractValidator<ReviewRequest>
    {
        public ReviewValidator()
        {
            RuleFor(x => x.Rating)
                .InclusiveBetween(0m, 5.0m)
                .Must(rating => Decimal.Round(rating, 1) == rating)
                .WithMessage("Rating must be between 0 and 5.0 with 1 decimal place.");


            RuleFor(x => x.Comment).MaximumLength(500);
        }
    }
}
