namespace FoodRescue.BLL.Contract.Reports.Create
{
    public class CreateReportDto
    {
        public Guid OrderId { get; set; }
        public Guid ProductId { get; set; }
        public string ListingName { get; set; } = string.Empty;
        public string IssueType { get; set; } = string.Empty; // QualityIssue, DamagingProduct, WrongItem, NotReceived
        public string Description { get; set; } = string.Empty;
        public string Priority { get; set; } = "Medium"; // High, Medium, Low
    }
}
