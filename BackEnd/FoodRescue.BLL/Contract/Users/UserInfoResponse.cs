using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Users
{
    public class UserInfoResponse
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string? ImageUrl { get; set; }
        public int OrderCount { get; set; }
        public decimal MoneySpent { get; set; }
        public decimal moneySaved { get; set; }

    }
}
