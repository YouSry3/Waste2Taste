using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.AdminDashbord.Users.Response
{
    public class UserListDto
    {
        public Guid Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public int OrdersCount { get; set; }

        public decimal TotalSpent { get; set; }

        public DateTime? LastOrderDate { get; set; }

        public bool IsActive { get; set; }

        public DateTime JoinedAt { get; set; }
    }
}
