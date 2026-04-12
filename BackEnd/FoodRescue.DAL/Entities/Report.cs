using FoodRescue.DAL.Consts;

namespace FoodRescue.DAL.Entities
{
    public class Report
    {
        public Guid Id { get; set; }
        public string ReportCode { get; set; } = string.Empty; // REP-001, REP-002, etc.

        // Customer Information
        public string CustomerName { get; set; } = string.Empty;
        public Guid UserId { get; set; }

        // Order & Product Information
        public Guid? OrderId { get; set; }
        public Guid ProductId { get; set; }
        public string ListingName { get; set; } = string.Empty;

        // Report Details
        public string IssueType { get; set; } = string.Empty; // QualityIssue, DamagingProduct, WrongItem, etc.
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending"; // Pending, InReview, Resolved
        public ReportPriority Priority { get; set; } = ReportPriority.Medium;

        // Resolution
        public decimal RefundAmount { get; set; } = 0;

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Relations
        public User? User { get; set; }
        public Product? Product { get; set; }
        public Order? Order { get; set; }
        public ICollection<ReportResponse> Responses { get; set; } = new List<ReportResponse>();
    }
}