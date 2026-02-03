using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Reports.Create
{
    public class ReportRequest
    {
        
        public Guid VendorId { get; set; }
        public string Type { get; set; } = null!;
        public string Description { get; set; } = null!;
    }
}
