

namespace FoodRescue.DAL.Entities
{
    public class Review
    {
        public int Id { get; set; }

        public decimal Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }

        // Foreign Keys
        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }

        // Navigation Properties
        public User User { get; set; }
        public Product Product { get; set; }
        public SentimentAnalysis SentimentAnalysis { get; set; }
    }


}
