using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Authentication.ForgetPassword.CheckCode
{
    public record VerifyResetCodeRequest(
        string Email,
        string Code);
}
