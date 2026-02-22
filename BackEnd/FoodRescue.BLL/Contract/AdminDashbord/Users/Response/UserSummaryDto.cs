using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.AdminDashbord.Users.Response
{
    public class UserSummaryDto
    {
        public Guid Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Initials { get; set; } = string.Empty;

        public decimal TotalSpent { get; set; }

        public int Rank { get; set; }
    }
}
