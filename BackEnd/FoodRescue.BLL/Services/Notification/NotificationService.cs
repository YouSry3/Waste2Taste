using FirebaseAdmin.Messaging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Services.Notification
{
    public class NotificationService : INotificationService
    {
        public async Task SendPushAsync(
            string token,
            string title,
            string body,
            Dictionary<string, string>? data = null)
        {
            var message = new Message()
            {
                Token = token,

                Notification = new FirebaseAdmin.Messaging.Notification
                {
                    Title = title,
                    Body = body
                },

                Data = data
            };

            await FirebaseMessaging.DefaultInstance.SendAsync(message);
        }
    }
}