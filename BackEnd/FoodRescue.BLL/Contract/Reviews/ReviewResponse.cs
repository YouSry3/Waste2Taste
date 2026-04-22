namespace FoodRescue.BLL.Contract.Reviews
{
    public class ReviewResponse
    {
        public int Id { get; set; }
        public decimal Rating { get; set; }
        public string Comment { get; set; } = null!;
        public InfoUser User { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
public class InfoUser
{
    public string Name { get; set; } = null!;
    public string? ImageUrl { get; set; }
}