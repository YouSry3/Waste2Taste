using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Reports.Update
{
    public class ReportStatusRequest
    {
        public string NewStatus { get; set; } = null!;
    }
}
