using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.AdminDashbord.Users.Response
{
    public class DashboardOverviewDto
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int TotalOrders { get; set; }
         public List<UserSummaryDto> TopSpenders { get; set; } = new();

    }
}
