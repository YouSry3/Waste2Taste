using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.AdminDashbord.Dashboard.Response
{
    public class DashboardResponse
    {
        public SummarySection Summary { get; set; } = new();
        public List<MonthlyTrendDto> Trends { get; set; } = new();
        public List<CategoryDistributionDto> Categories { get; set; } = new();
    }

}
