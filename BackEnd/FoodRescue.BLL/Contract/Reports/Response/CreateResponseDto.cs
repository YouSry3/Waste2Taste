namespace FoodRescue.BLL.Contract.Reports.Response
{
    public class CreateResponseDto
    {
        public Guid ReportId { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? AttachmentUrl { get; set; }
    }
}
