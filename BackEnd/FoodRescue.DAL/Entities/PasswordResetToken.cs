using System;

namespace FoodRescue.DAL.Entities
{
    public class PasswordResetToken
    {
        public Guid Id { get; set; }

        public string Email { get; set; }

        public string Code { get; set; }   // OTP Code

        public DateTime ExpireAt { get; set; }  // Expiry time

        public bool IsUsed { get; set; } = false;
    }
}
