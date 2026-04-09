namespace FoodRescue.DAL.Entities
{
    public class User
    {
        public Guid Id { get; set; }

        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Role { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public string? ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; }

        // 🔥 NEW FIELDS (Refresh Token Support)
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }

        public ICollection<Review> Reviews { get; set; }
        public ICollection<Order> Orders { get; set; }
    }
}