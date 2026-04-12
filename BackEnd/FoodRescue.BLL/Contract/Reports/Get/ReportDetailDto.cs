using FoodRescue.BLL.Contract.Reports.Response;

namespace FoodRescue.BLL.Contract.Reports.Get
{
    public class ReportDetailDto
    {
        public Guid Id { get; set; }
        public string ReportCode { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public Guid? OrderId { get; set; }
        public string ListingName { get; set; } = string.Empty;
        public string IssueType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public decimal RefundAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<ReportResponseDto> Responses { get; set; } = new();
    }
}
