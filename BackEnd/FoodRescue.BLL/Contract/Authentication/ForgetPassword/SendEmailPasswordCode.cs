using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Authentication.ForgetPassword
{
    public record SendEmailPasswordCode(string To, string Subject, string Body);
}
