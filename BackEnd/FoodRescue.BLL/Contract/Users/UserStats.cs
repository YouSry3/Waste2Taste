using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.DTOs
{
    public class UserStats
    {
        public int Orders { get; set; }
        public decimal MoneySpent { get; set; }
        public decimal MoneySaved { get; set; }
    }
}
