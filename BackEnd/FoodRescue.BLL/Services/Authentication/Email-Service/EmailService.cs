using FluentEmail.Core;
namespace FoodRescue.BLL.Services.Authentication.Email_Service
{
    

    public class EmailService
    {
        private readonly IFluentEmail _email;

        public EmailService(IFluentEmail email)
        {
            _email = email;
        }

        public async Task<bool> SendEmailAsync(string to, string subject, string body)
        {
            var result = await _email
                .To(to)
                .Subject(subject)
                .Body(body, isHtml: true)
                .SendAsync();

            return result.Successful;
        }
    }

}
