using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.Products
{
    public class ProductRequest
    {
            public Guid vendorId { get; set; }
            public bool expired { get; set; }
    }
}
