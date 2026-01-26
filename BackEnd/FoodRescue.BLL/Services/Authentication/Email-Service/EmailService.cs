using FluentEmail.Core;
using FoodRescue.BLL.Settings;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace FoodRescue.BLL.Services.Authentication.Email_Service
{



    public class EmailService
    {
        private readonly EmailSettings _settings;

        public EmailService(IOptions<EmailSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task SendAsync(string to, string subject, string html)
        {
            System.Net.ServicePointManager.SecurityProtocol =
                System.Net.SecurityProtocolType.Tls12;

            using var client = new SmtpClient(_settings.Host, _settings.Port)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(
                    _settings.Username,
                    _settings.Password)
            };

            var message = new MailMessage
            {
                From = new MailAddress(_settings.Username, "FoodRescue API"),
                Subject = subject,
                Body = html,
                IsBodyHtml = true
            };

            message.To.Add(to);

            await client.SendMailAsync(message);
        }
    }



}
