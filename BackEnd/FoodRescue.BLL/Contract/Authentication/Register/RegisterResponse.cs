

namespace FoodRescue.BLL.Contract.Authentication.Register
{
    public record RegisterResponse(
        string Email,
        string Name,
        string Role
        );
    
}
