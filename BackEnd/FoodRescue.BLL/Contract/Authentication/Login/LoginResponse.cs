namespace FoodRescue.BLL.Contract.Authentication.Login
{
    public record LoginResponse(
<<<<<<< HEAD
        Guid Id,    
=======
        Guid Id,
>>>>>>> 0b53e5a9bd434d76452ce4933fe42fa5c6ae7fb1
        string Name,
        string Email,
        string Role,
        string Token,
        int ExpireAt,
        string RefreshToken,
        string? ImageUrl,
        Guid? VendorId);  // ← ADD
}