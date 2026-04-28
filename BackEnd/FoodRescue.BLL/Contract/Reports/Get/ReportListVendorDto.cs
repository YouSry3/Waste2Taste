using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Reports.Get
{
    public class ReportListVendorDto
    {
        public Guid Id { get; set; }
        public string ReportCode { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string ListingName { get; set; } = string.Empty;
        public string IssueType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public decimal? RefundAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public int ResponseCount { get; set; }
    }
}
