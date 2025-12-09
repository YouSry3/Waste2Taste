namespace FoodRescue.BLL.Services.Authentication.Email_Service;

public interface IEmailService
{
    Task<bool> SendEmailAsync(string to, string subject, string body);
}
