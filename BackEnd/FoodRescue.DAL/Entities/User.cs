namespace FoodRescue.DAL.Entities
{
    // USERS (All Types - Admin, Vendor, Customer)
    public class User
    {
        public Guid Id { get; set; }

        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; } // added for dashboard

        public string Name { get; set; } = string.Empty;
        // admin, vendor, customer, some other types in the future
        public string Role { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; }

        public ICollection<Review> Reviews { get; set; }
        public ICollection<Order> Orders { get; set; }

    }
}
