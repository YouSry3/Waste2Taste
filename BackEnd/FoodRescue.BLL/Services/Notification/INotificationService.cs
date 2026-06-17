using System.Collections.Generic;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Services.Notification
{
    public interface INotificationService
    {
        Task SendPushAsync(
            string token,
            string title,
            string body,
            Dictionary<string, string>? data = null
        );
    }
}