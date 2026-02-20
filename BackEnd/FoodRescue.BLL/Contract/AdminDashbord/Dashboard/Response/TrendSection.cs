using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.AdminDashbord.Dashboard.Response
{
    public class TrendSection
    {
        public List<MonthlyTrendDto> MonthlyData { get; set; } = new();
    }
    public class MonthlyTrendDto
    {
        public string Month { get; set; } = null!;
        public decimal Revenue { get; set; }
        public int Orders { get; set; }
    }
}
