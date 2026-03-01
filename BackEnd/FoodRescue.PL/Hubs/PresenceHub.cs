using FoodRescue.DAL.Context;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace FoodRescue.Hubs
{
    public class PresenceHub : Hub
    {
        private static readonly Dictionary<string, string> OnlineUsers = new();

        public override async Task OnConnectedAsync()
        {
            var userId = Context.GetHttpContext()!.Request.Query["userId"].ToString();

            if (!string.IsNullOrEmpty(userId))
            {
                OnlineUsers[userId] = Context.ConnectionId;
                await Clients.All.SendAsync("UserOnline", userId);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var user = OnlineUsers.FirstOrDefault(x => x.Value == Context.ConnectionId);

            if (user.Key != null)
            {
                OnlineUsers.Remove(user.Key);
                await Clients.All.SendAsync("UserOffline", user.Key);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public static bool IsUserOnline(string userId) => OnlineUsers.ContainsKey(userId);

        public static List<string> GetOnlineUsers() => OnlineUsers.Keys.ToList();
    }
}