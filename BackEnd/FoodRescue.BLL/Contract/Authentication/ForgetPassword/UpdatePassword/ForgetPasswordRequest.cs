using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Authentication.ForgetPassword.UpdatePassword
{
    public record ForgetPasswordRequest(
        string email,
        string code,
        string newpassword);
}
