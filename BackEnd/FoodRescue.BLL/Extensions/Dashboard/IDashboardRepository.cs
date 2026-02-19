using FoodRescue.BLL.Abstractions;
using FoodRescue.BLL.Contract.AdminDashbord.Dashboard.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodRescue.BLL.Extensions.Dashboard
{
    public interface IDashboardRepository
    {
        Task<Result<Decimal>> GetTotalRevenueAsync(int days);
        Task<Result<int>> GetActiveUsersCountAsync(int days);
        Task<Result<int>> GetVendorsCountAsync(int days);
        Task<Result<int>> GetOrdersCountAsync(int days);
        Task<List<MonthlyTrendDto>> GetMonthlyTrendsAsync(int days);
        Task<List<CategoryDistributionDto>> GetCategoryDistributionAsync();
    }
}
