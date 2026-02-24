using FoodRescue.BLL.ResultPattern;
using FoodRescue.BLL.Contract.AdminDashbord.Dashboard.Response;
using FoodRescue.BLL.Contract.AdminDashbord.Users;
using FoodRescue.BLL.Contract.AdminDashbord.Users.Response;
using FoodRescue.BLL.Contract.AdminDashbord.Vendors.Response;
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
        Task<Result<VendorOverviewDto>> GetOverviewAsync();
        Task<Result<PagedResultDto<VendorListItemDto>>> GetVendorsAsync(
        int page, int limit, string search, string sortBy, string order);

        Task<Result<DashboardOverviewDto>> GetUserOverViewAsync();
        Task<Result<List<UserSummaryDto>>> GetTopSpendersAsync(int top);
        Task<Result<PagedResult<UserListDto>>> GetUsersAsync(UserFilter filter);





    }
}
