using FoodRescue.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Services.JWT
{
    public interface IJwtProvider
    {
        (String Token, int ExpiresIn) GenerateToken(User user);
        String? ValidateToken(string token);
    }
}
