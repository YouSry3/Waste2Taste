

using FluentValidation;


namespace FoodRescue.BLL.Contract.Authentication.Register
{
    public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
    {
        public RegisterRequestValidator() { 
            
            RuleFor(x=>x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("A valid email is required.");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("First name is required.")
                .MaximumLength(50).WithMessage("First name must not exceed 50 characters.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required.")
                .Length(8, 100).WithMessage("Password must be between 8 and 100 characters.");

            RuleFor(x => x.Type)
                .NotEmpty().WithMessage("Type is required.")
                //admin, vendor, customer
                .Must(type => type == "Customer" || type == "Admin" || type == "Vendor")
                .WithMessage("Type must be either 'customer' or 'admin' or 'vendor' ");


        }
    }
}
