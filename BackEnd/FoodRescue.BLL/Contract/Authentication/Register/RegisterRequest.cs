

namespace FoodRescue.BLL.Contract.Authentication.Register
{
    public record RegisterRequest(
        string Email,
        string Password,
        string Name,
        string Role,
        string PhoneNumber);
   
}
