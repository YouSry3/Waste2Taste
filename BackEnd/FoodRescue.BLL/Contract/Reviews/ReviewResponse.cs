using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Reviews
{
    public class ReviewResponse
    {
        public int Id { get; set; }
        public decimal Rating { get; set; }
        public string Comment { get; set; }
        public string UserName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
