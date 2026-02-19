using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Contract.AdminDashbord.Dashboard.Response
{
    public class CategorySection
    {
        public List<CategoryDistributionDto> Distribution { get; set; } = new();
    }

    public class CategoryDistributionDto
    {
        public string CategoryName { get; set; } = null!;
        public int Count { get; set; }
        public decimal Percentage { get; set; }
    }
}
