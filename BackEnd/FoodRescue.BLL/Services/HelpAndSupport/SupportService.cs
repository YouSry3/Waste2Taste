using FoodRescue.BLL.Services.Authentication.Email_Service;
using Microsoft.AspNetCore.Identity;

namespace FoodRescue.BLL.Services.Support
{
    public class SupportService
    {
        private readonly EmailService _emailService;
        private readonly IUserRepository _userRepository;

        private const string SupportEmail = "waste2tastesupport@gmail.com";

        public SupportService(
            EmailService emailService,
            IUserRepository userManager)
        {
            _emailService = emailService;
            _userRepository = userManager;
        }

        public async Task SendSupportRequestAsync(
            string subject,
            string description,
            Guid userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
                throw new Exception("User not found");

            var emailSubject = $"Support Request - {subject}";

            var emailBody = $@"
<div style='
    font-family: Arial, Helvetica, sans-serif;
    background-color: #f4f4f4;
    padding: 40px;
'>
    <div style='
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    '>

        <div style='
            background-color: #2E7D32;
            color: white;
            padding: 20px;
            text-align: center;
        '>
            <h1 style='margin:0;'>FoodRescue Support</h1>
        </div>

        <div style='padding: 30px;'>

            <h2 style='
                color: #333333;
                margin-bottom: 25px;
            '>
                New Customer Support Request
            </h2>

            <div style='margin-bottom: 20px;'>

                <p style='margin: 8px 0;'>
                    <strong>User ID:</strong> {user.Id}
                </p>

                <p style='margin: 8px 0;'>
                    <strong>User Email:</strong> {user.Email}
                </p>

                <p style='margin: 8px 0;'>
                    <strong>Subject:</strong> {subject}
                </p>
            </div>

            <div style='
                background-color: #f9f9f9;
                padding: 20px;
                border-left: 4px solid #2E7D32;
                border-radius: 8px;
            '>
                <p style='
                    margin: 0 0 10px 0;
                    font-weight: bold;
                    color: #333;
                '>
                    Description
                </p>

                <p style='
                    margin: 0;
                    color: #555;
                    line-height: 1.7;
                '>
                    {description}
                </p>
            </div>
        </div>

        <div style='
            background-color: #fafafa;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #888;
            border-top: 1px solid #eeeeee;
        '>
            © 2026 FoodRescue - Customer Support System
        </div>
    </div>
</div>
";

            await _emailService.SendAsync(
                SupportEmail,
                emailSubject,
                emailBody
            );
        }
    }
}