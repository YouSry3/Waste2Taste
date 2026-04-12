namespace FoodRescue.DAL.Entities
{
    public class ReportResponse
    {
        public Guid Id { get; set; }
        public Guid ReportId { get; set; }
        public Guid ResponderId { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Attachment { get; set; } // URL to file/image
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Relations
        public Report? Report { get; set; }
        public User? Responder { get; set; }
    }
}
