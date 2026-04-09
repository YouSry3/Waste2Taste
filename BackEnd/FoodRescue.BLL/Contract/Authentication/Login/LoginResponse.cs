using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Authentication.Login
{
    public record LoginResponse(
        string Name,
        string Email,
        string Role,
        string Token,
        int ExpireAt,
        string RefreshToken,
        string? ImageUrl);
    
}
