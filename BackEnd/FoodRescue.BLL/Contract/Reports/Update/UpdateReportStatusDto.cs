namespace FoodRescue.BLL.Contract.Reports.Update
{
    public class UpdateReportStatusDto
    {
        public string Status { get; set; } = string.Empty; // Pending, InReview, Resolved
        public decimal? RefundAmount { get; set; }
        public string? AdminNotes { get; set; }
    }
}
