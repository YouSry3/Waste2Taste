using FluentEmail.Core;
namespace FoodRescue.BLL.Services.Authentication.Email_Service
{

<<<<<<< HEAD

    public class EmailService : IEmailService
=======
    public class EmailService 
>>>>>>> 9173f275ccb25c1a2a53afe30b3817e1a185a5c8
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
