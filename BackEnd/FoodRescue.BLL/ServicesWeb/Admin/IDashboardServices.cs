using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Contract.AdminDashbord.Dashboard.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.ServicesWeb.Admin
{
    public interface IDashboardServices
    {
        Task<Result<DashboardResponse>> GetDashboardAsync(int days);

       

    }
}
