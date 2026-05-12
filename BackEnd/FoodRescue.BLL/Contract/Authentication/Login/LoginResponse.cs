namespace FoodRescue.BLL.Contract.Authentication.Login
{
    public record LoginResponse(
        Guid Id,
        string Name,
        string Email,
        string Role,
        string Token,
        int ExpireAt,
        string RefreshToken,
        string? ImageUrl);


}
