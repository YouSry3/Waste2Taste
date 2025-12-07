using FluentValidation;


namespace FoodRescue.BLL.Contract.Authentication.ForgetPassword.CheckCode
{
    public class VerifyResetCodeRequestValidator : AbstractValidator<VerifyResetCodeRequest>
    {
        public VerifyResetCodeRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.");

            RuleFor(x => x.Code)
                .NotEmpty().WithMessage("Reset code is required.")
                .Length(6).WithMessage("Reset code must be 6 characters long.");


        }
    }
}