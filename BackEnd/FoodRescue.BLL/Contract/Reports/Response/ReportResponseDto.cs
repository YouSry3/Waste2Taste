namespace FoodRescue.BLL.Contract.Reports.Response
{
    public class ReportResponseDto
    {
        public Guid Id { get; set; }
        public Guid ReportId { get; set; }
        public string ResponderName { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? Attachment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
