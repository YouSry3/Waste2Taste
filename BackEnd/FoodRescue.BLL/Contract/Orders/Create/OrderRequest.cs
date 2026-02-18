using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Orders.Create
{
    public class OrderRequest
    {
        public Guid ProductId { get; set; }
    }
}
