namespace FoodRescue.BLL.Contract.Reports.Stats
{
    public class ReportStatsDto
    {
        public int TotalReports { get; set; }
        public int PendingReports { get; set; }
        public int InReviewReports { get; set; }
        public int ResolvedReports { get; set; }
        public int HighPriorityReports { get; set; }
        public decimal TotalRefundAmount { get; set; }
        public double AverageResolutionTime { get; set; } // in hours
        public Dictionary<string, int> ReportsByType { get; set; } = new();
        public Dictionary<string, int> ReportsByPriority { get; set; } = new();
    }
}
